/*
*    main.js
*/

var svg = d3.select("#chart-area").append("svg")
	.attr("width", 400)
	.attr("height", 400);


var circle1 = svg.append("circle")
	.attr("cx", 100)
	.attr("cy", 100)
	.attr("r", 25)
	.attr("fill", "blue");

var circle2 = svg.append("circle")
	.attr("cx", 200)
	.attr("cy", 100)
	.attr("r", 25)
	.attr("fill", "blue");

var rect1 = svg.append("rect")
	.attr("x", 100)
	.attr("y", 150)
	.attr("width", 100)
	.attr("height", 50)
	.attr("fill","red");

var rect2 = svg.append("rect")
	.attr("x", 75)
	.attr("y", 50)
	.attr("width", 50)
	.attr("height", 20)
	.attr("fill","red");

var rect3 = svg.append("rect")
	.attr("x", 175)
	.attr("y", 50)
	.attr("width", 50)
	.attr("height", 20)
	.attr("fill","red");