/*
*    main.js
*/

/*
*    main.js
*/

d3.json("data/revenues.json").then(data => {
    data.forEach(d => {
        d.revenue = +d.revenue
    });
    
    console.log(data)

    var max_h = d3.max(data, d => d.revenue)
    var m = {l: 100, t: 10, r: 10, b: 100}
    var ch = 400
    var cw = 600

    var w = cw - m.l - m.r
    var h = ch - m.t - m.b

    var svg = d3.select("#chart-area").append("svg")
        .attr("width", cw)
        .attr("height", ch)

    var g = svg.append("g")
        .attr("transform", "translate(" + m.l + ", " + m.t + ")");
        
    var x = d3.scaleBand()
        .domain(data.map(d => d.month))
        .range([0,w])
        .paddingInner(0.3)
        .paddingOuter(0.3)
    
    var bottomAxis = d3.axisBottom(x);
        
    g.append("g")
        .attr("class", "bottom axis")
        .attr("transform", "translate(0, " + h + ")")
        .call(bottomAxis)
        .selectAll("text")
        // .attr("y", "10")
        // .attr("x", "-5")
        // .attr("text-anchor", "end")
        // .attr("transform", "rotate(-40)")
    
    g.append("text")
        .attr("class", "x axis-label")
        .attr("x", w / 2)
        .attr("y", h + 40)
        .attr("font-size", "16px")
        .attr("text-anchor", "middle")
        .text("Month");

    g.append("text")
        .attr("class", "y axis-label")
        .attr("x", -(h / 2))
        .attr("y", -40)
        .attr("font-size", "16px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Revenue (dlls.)");

    var y = d3.scaleLinear()
        .domain([0,max_h])
        .range([h,0])

    var leftAxis = d3.axisLeft(y)
        .ticks(5)
        .tickFormat(d => d/1000 + " k")

    g.append("g")
    .attr("class", "left axis")
    .call(leftAxis)

    const color = d3.scaleOrdinal()
    .domain(data.map(d => d.month))
    .range(d3.schemeSet3)

    g.selectAll("rect")
        .data(data).enter().append("rect")
            .attr("x", d => x(d.month))
            .attr("y", d => y(d.revenue))
            .attr("width", x.bandwidth())
            .attr("height", d => h - y(d.revenue))
            .attr("fill", d => color(d.month))
})