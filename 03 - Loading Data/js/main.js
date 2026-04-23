/*
*    main.js
*/

var svg = d3.select("#chart-area").append("svg")
    .attr("height", 1000)
    .attr("width", 1000)

d3.json("data/ages.json").then((data)=> {
    data.forEach(d => {
        d.age = +d.age
    });
    
	console.log(data);

    var max_r = 40
    var max_age = d3.max(data, d => d.age);

    data.forEach((d, i) => {
        var r = (d.age * max_r) / max_age

        var circle = svg.append("circle")
            .attr("cx", max_r + i * (max_r * 2))
            .attr("cy", 100)
            .attr("r", r)
            .attr("fill", d.age > 10 ? "red" : "blue");
    })
}).catch(error => {
    console.error("Error:", error)
})
