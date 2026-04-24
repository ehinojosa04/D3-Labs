/*
*    main.js
*/

pause = false
const pauseButton = d3.select("#pause-btn").text("Pause")
const resetButton = d3.select("#reset-btn")
const slider = d3.select("#year-slider")
const sliderValue = d3.select("#slider-value")
const sliderLabel = d3.select("#slider-label")

var m = {l: 100, t: 10, r: 10, b: 100}
var ch = 400
var cw = 600

var w = cw - m.l - m.r
var h = ch - m.t - m.b

var svg = d3.select("#chart-area").append("svg")
    .attr("width", cw)
    .attr("height", ch)
    
var g = svg.append("g").attr("transform", "translate(" + m.l + ", " + m.t + ")");

const tip = d3.tip()
    .attr("class", "d3-tip")
    .html(d => {
        return `
            <strong>Country:</strong> ${d.country}<br/>
            <strong>Continent:</strong> ${d.continent}<br/>
            <strong>Income:</strong> $${d.income}<br/>
            <strong>Life Exp:</strong> ${d.life_exp}<br/>
            <strong>Population:</strong> ${d.population}
        `
    })

g.call(tip)

var x = d3.scaleLog()
    .range([0,w])
	.domain([142, 150000])

var bottomAxis = d3.axisBottom(x)
	.tickValues([400,4000,40000])
	.tickFormat(d => "$ "+ d)

var xAxisGroup = g.append("g")
    .attr("class", "bottom axis")
    .attr("transform", "translate(0, " + h + ")")
	.call(bottomAxis)

g.append("text")
    .attr("class", "x axis-label")
    .attr("x", w / 2)
    .attr("y", h + 40)
    .attr("font-size", "16px")
    .attr("text-anchor", "middle")
    .text("GDP Per Capita ($)");

var y = d3.scaleLinear()
    .range([h,0])
	.domain([0, 90])

var leftAxis = d3.axisLeft(y)

g.append("text")
    .attr("class", "y axis-label")
    .attr("x", -(h / 2))
    .attr("y", -40)
    .attr("font-size", "16px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
	.text("Age Expectancy (Years)")


var yAxisGroup = g.append("g")
    .attr("class", "left axis")
	.call(leftAxis)

var yearLabel = g.append("text")
    .attr("class", "year-label")
    .attr("x", w - 50)          
    .attr("y", h - 20)          
    .attr("text-anchor", "end")
    .attr("font-size", "40px")
    .attr("fill", "gray")
    .attr("opacity", 0.5)
    .text("1800")

var area = d3.scaleLinear()
	.domain([2000, 1400000000])
	.range([25*Math.PI, 1500*Math.PI])

var color = d3.scaleOrdinal().range(d3.schemePastel1)

const legend = g.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${w - 120}, 20)`)


let formattedData;
let interval;
let currentYearIndex = 0;
let years;

pauseButton.on("click", function () {
    if (!pause) {
        clearInterval(interval)
        pauseButton.text("Play")
    } else {
        interval = setInterval(step, 1000)
        pauseButton.text("Pause")
    }
    pause = !pause
})

resetButton.on("click", function () {
	currentYearIndex = 0
	step()
})

slider.on("input", function () {
    const index = +this.value
    currentYearIndex = index

    const yearlyData = formattedData[index]

    if (yearlyData) {
        update(yearlyData.countries, yearlyData.year)
        sliderValue.text(yearlyData.year)
		sliderLabel.text("Year: " + yearlyData.year)
    }

    clearInterval(interval)
    pause = true
    pauseButton.text("Play")
})

d3.json("data/data.json").then(function(data){
	formattedData = data.map(year => {
		return {
			year: +year.year,
			countries: year.countries
				.filter(c => c.income && c.life_exp)
				.map(c => {
					return {
						...c,
						income: +c.income,
						life_exp: +c.life_exp
					}
				})
		}
	});

	slider
		.attr("min", 0)
		.attr("max", formattedData.length - 1)
		.attr("step", 1)

	console.log(formattedData);

	const continents = [...new Set(
    	formattedData.flatMap(d => d.countries.map(c => c.continent))
	)]

	console.log(continents)

	d3.select("#continent-select")
		.selectAll("option")
		.data(["all"].concat(continents))
		.enter()
		.append("option")
		.attr("value", d => d)
		.text(d => d)

	color.domain(continents)

	const legendItems = legend.selectAll(".legend-item")
		.data(color.domain())
		.enter()
		.append("g")
		.attr("class", "legend-item")
		.attr("transform", (d, i) => `translate(0, ${i * 20})`)

	legendItems.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", 12)
		.attr("height", 12)
		.attr("fill", d => color(d))

	legendItems.append("text")
		.attr("x", 20)
		.attr("y", 10)
		.text(d => d)
		.attr("font-size", "12px")

	years = data.map(d => d.year).sort()
	interval = setInterval(step, 1000)
})

function step(){
	const yearlyData = formattedData[currentYearIndex]

	if (yearlyData) {
		update(yearlyData.countries, yearlyData.year)
		slider.property("value", currentYearIndex)
        sliderValue.text(yearlyData.year)
		sliderLabel.text("Year: " + yearlyData.year)
	}

	currentYearIndex = currentYearIndex < years.length - 1 ? currentYearIndex + 1 : 0
}

function update(data, currentYear){
	const selected = d3.select("#continent-select").property("value")
	let filteredData = data

	if (selected !== "all") {
		filteredData = data.filter(d => d.continent === selected)
	}

	xAxisGroup.call(bottomAxis)
	yAxisGroup.call(leftAxis)
	yearLabel.text(currentYear)

	const bubbles = g.selectAll("circle")
		.data(filteredData, d => d.country)

	bubbles
		.exit()
		.transition()
		.duration(500)
		.attr("r", 0)
		.remove()
	
	bubbles
		.on("mouseover", tip.show)
		.on("mouseout", tip.hide)
		.transition()
		.duration(500)
		.attr("cx", d => x(d.income))
		.attr("cy", d => y(d.life_exp))
		.attr("r", d => Math.sqrt(area(d.population)/Math.PI))
		.attr("fill", d => color(d.continent))

	bubbles.enter()
		.append("circle")
		.attr("cx", d => x(d.income))
		.attr("cy", d => y(d.life_exp))
		.attr("fill", d => color(d.continent))
		.attr("r", 0)
		.on("mouseover", tip.show)
		.on("mouseout", tip.hide)
		.transition()
    	.duration(500)
		.attr("r", d => Math.sqrt(area(d.population)/Math.PI))
	}