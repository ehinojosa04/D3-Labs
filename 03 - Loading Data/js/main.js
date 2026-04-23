/*
*    main.js
*/

var svg = d3.select("#chart-area").append("svg")
    .attr("height", 1000)
    .attr("width", 1000);

d3.json("data/ages.json").then((data) => {

    data.forEach(d => {
        d.age = +d.age;
    });

    console.log(data);

    var max_r = 40;
    var max_age = d3.max(data, d => d.age);

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d, i) => max_r + i * (max_r * 2))
        .attr("cy", 100)
        .attr("r", d => (d.age * max_r) / max_age)
        .attr("fill", d => d.age > 10 ? "red" : "blue");

}).catch(error => {
    console.error("Error:", error);
});