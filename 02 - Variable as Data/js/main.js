/*
*    main.js
*/

var data = [25, 20, 15, 10, 5];
var ceil = Math.max(...data)

var sh = 400
var sw = 400

var svg = d3.select("#chart-area").append("svg")
	.attr("width", sw)
	.attr("height", sh);

data.forEach((n, i) => {
    var h = (n * sh)/ceil 

    var rect = svg.append("rect")
        .attr("x", i * 50)
        .attr("y", sh - h)
        .attr("width", 40)
        .attr("height", h)
        .attr("fill","red");
})