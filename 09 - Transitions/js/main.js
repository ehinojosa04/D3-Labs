/*
*    main.js
*/

/*
*    main.js
*/

var flag = true

var m = {l: 100, t: 10, r: 10, b: 100}
var ch = 400
var cw = 600

var w = cw - m.l - m.r
var h = ch - m.t - m.b

var svg = d3.select("#chart-area").append("svg")
    .attr("width", cw)
    .attr("height", ch)
    
var g = svg.append("g").attr("transform", "translate(" + m.l + ", " + m.t + ")");
    
var x = d3.scaleBand()
    .range([0,w])
    .paddingInner(0.3)
    .paddingOuter(0.3)
    
var bottomAxis = d3.axisBottom(x);

var xAxisGroup = g.append("g")
    .attr("class", "bottom axis")
    .attr("transform", "translate(0, " + h + ")")

g.append("text")
    .attr("class", "x axis-label")
    .attr("x", w / 2)
    .attr("y", h + 40)
    .attr("font-size", "16px")
    .attr("text-anchor", "middle")
    .text("Month");

var y_label = g.append("text")
    .attr("class", "y axis-label")
    .attr("x", -(h / 2))
    .attr("y", -40)
    .attr("font-size", "16px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")

var y = d3.scaleLinear()
    .range([h,0])

var leftAxis = d3.axisLeft(y)
    .ticks(5)

var yAxisGroup = g.append("g")
    .attr("class", "left axis")

const color = d3.scaleOrdinal()
    .range(d3.schemeSet3)

d3.json("data/revenues.json").then(data => {
    data.forEach(d => {
        d.revenue = +d.revenue
        d.profit = +d.profit
    });
    
    console.log(data)
    
    d3.interval( ( ) => {
        var newData = flag ? data : data.slice(1);
		update(newData);
        flag = !flag
	}, 1000);
})

function update(data){
    const value = flag ? "revenue" : "profit"
    y_label.text(value + " (dlls.)")
    
    x.domain(data.map(d => d.month))
    
    const max_h = d3.max(data, d => d[value])
    y.domain([0, max_h])

    leftAxis.tickFormat(d => d/1000 + " k")

    color.domain(data.map(d => d.month))

    xAxisGroup
        .transition()
        .duration(500)
        .call(bottomAxis)

    yAxisGroup
        .transition()
        .duration(500)
        .call(leftAxis)

    const bars = g.selectAll("rect")
        .data(data, d => d.month)

    bars.exit()
        .transition()
        .duration(500)
        .attr("y", h)
        .attr("height", 0)
        .remove()

    bars.transition()
        .duration(500)
        .attr("x", d => x(d.month))
        .attr("y", d => y(d[value]))
        .attr("width", x.bandwidth())
        .attr("height", d => h - y(d[value]))

    bars.enter()
        .append("rect")
        .attr("x", d => x(d.month))
        .attr("y", h)
        .attr("width", x.bandwidth())
        .attr("height", 0)
        .attr("fill", d => color(d.month))
        .transition()
        .duration(500)
        .attr("y", d => y(d[value]))
        .attr("height", d => h - y(d[value]))
}