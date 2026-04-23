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
        .attr("height", 500)
        .attr("width", 500)

    var x = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0,500])
        .paddingInner(0.3)
        .paddingOuter(0.3)

    var y = d3.scaleLinear()
        .domain([0,max_h])
        .range([500,0])

    const color = d3.scaleOrdinal()
    .domain(data.map(d => d.name))
    .range(d3.schemeSet3)

    svg.selectAll("rect")
        .data(data).enter().append("rect")
            .attr("x", d => x(d.name))
            .attr("y", d => y(d.height))
            .attr("width", x.bandwidth())
            .attr("height", d => 500 - y(d.height))
            .attr("fill", d => color(d.name))
})