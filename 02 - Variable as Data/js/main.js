/*
*    main.js
*/var data = [25, 20, 15, 10, 5];
var ceil = Math.max(...data);

var sh = 400;
var sw = 400;

var svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", sw)
    .attr("height", sh);

svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * 50)
    .attr("width", 40)
    .attr("fill", "red")
    .attr("height", d => (d * sh) / ceil)
    .attr("y", d => sh - (d * sh) / ceil);