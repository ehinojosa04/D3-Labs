/*
*    main.js
*/

d3.json("data/buildings.json").then(data => {
    data.forEach(d => {
        d.height = +d.height
    });
    
    console.log(data)
    max_h = d3.max(data, d => d.height)

    var svg = d3.select("#chart-area").append("svg")
        .attr("height", max_h)
        .attr("width", 50 * data.length)

    svg.selectAll("rect")
        .data(data).enter().append("rect")
            .attr("x", (d,i) => i * 50)
            .attr("y", d => max_h - d.height)
            .attr("width", 40)
            .attr("height", d => d.height)
            .attr("fill", "red")
})