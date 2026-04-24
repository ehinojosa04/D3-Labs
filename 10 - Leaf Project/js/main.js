/*
*    main.js
*/

var m = {l: 100, t: 10, r: 10, b: 100}
var ch = 400
var cw = 600

var w = cw - m.l - m.r
var h = ch - m.t - m.b

var svg = d3.select("#chart-area").append("svg")
    .attr("width", cw)
    .attr("height", ch)
    
var g = svg.append("g").attr("transform", "translate(" + m.l + ", " + m.t + ")");


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

d3.json("data/data.json").then(function(data){
	const formattedData = data.map(year => {
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

	console.log(formattedData);

	const continents = [...new Set(
    	data.flatMap(d => d.countries.map(c => c.continent))
	)]

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

	var years = data.map(d => d.year).sort()
	var currentYear = years[0]

	d3.interval(() => {
		const yearlyData = formattedData.find(d => d.year === currentYear)

		if (yearlyData) {
			update(yearlyData.countries, currentYear)
		}

		currentYear++
		if (currentYear > years[years.length - 1]) currentYear = years[0]
	}, 1000)
})	

function update(data, currentYear){
	xAxisGroup.call(bottomAxis)
	yAxisGroup.call(leftAxis)
	yearLabel.text(currentYear)

	const bubbles = g.selectAll("circle")
		.data(data, d => d.country)

	bubbles
		.exit()
		.transition()
		.duration(500)
		.attr("r", 0)
		.remove()
	
	bubbles
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
		.transition()
    	.duration(500)
		.attr("r", d => Math.sqrt(area(d.population)/Math.PI))
	}