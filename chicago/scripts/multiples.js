var margin = {top: 30, right: 15, bottom: 10, left: 40},
    width = 160 - margin.left - margin.right,
    height = 160 - margin.top - margin.bottom;

var xScale = d3.scaleLinear()
    .range([0, width]);

var yScale = d3.scaleLinear()
    .range([height, 0]);

var xAxis = d3.axisBottom()
    .scale(xScale)
    .ticks(0);

var yAxis = d3.axisLeft()
    .scale(yScale)
    .ticks(3);

var area = d3.area()
    .x(function(d) { return xScale(d.year); })
    .y0(height + 60)
    .y1(function(d) { return yScale(d.value); });

var line = d3.line()
    .x(function(d) { return xScale(d.year); })
    .y(function(d) { return yScale(d.value); });

d3.csv("data/metro.csv", convertTextToNumbers, function(error, data) {

    xScale.domain(d3.extent(data, function(d) { return d.year; }));
    yScale.domain([5,70]);

    var cities = d3.nest()
        .key(function(d) { return d.city; })
        .entries(data);

    var svg = d3.select("#chiMultiples").selectAll("svg")
        .data(cities)
        .enter().append("svg")
        .style("margin-bottom", "4px")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + 2*margin.top + 2*margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("path")
        .attr("class", "multiples-lineLow")
        .attr("d", function(d) {
            return line(d.values.filter(obj => {
                return obj.income === 'low'
            })); })

    svg.append("path")
        .attr("class", "multiples-lineMid")
        .attr("d", function(d) {
            return line(d.values.filter(obj => {
                return obj.income === 'middle'
            })); })

    svg.append("path")
        .attr("class", "multiples-lineHigh")
        .attr("d", function(d) {
            return line(d.values.filter(obj => {
                return obj.income === 'high'
            })); })

    svg.append("text")
        .attr("class", "multiples-cityTitle")
        .attr("x", (width + 2)/2)
        .attr("y", height - 128)
        .style("text-anchor", "middle")
  		    .text(function(d) { return d.key; });	

    svg.append("text")
  	    .text(xScale.domain()[0])
        .attr("class", "multiples-yearAxis")
        .attr("x", 0)
        .attr("y", height + 15)
        .style("text-anchor", "start")

    svg.append("text")
  	    .text(xScale.domain()[1])
        .attr("class", "multiples-yearAxis")
        .attr("x", width)
        .attr("y", height + 15)
        .style("text-anchor", "end");

	svg.append("g")
        .attr("id", "yAxisG")
        .call(yAxis);

	d3.selectAll("path.domain")
        .remove();

    svg.append("g")
        .attr("id", "xAxisG")
        .attr("transform", "translate(0," + (height - 5) + ")")
        .call(xAxis)

	d3.selectAll("line")
        .style("stroke", "silver")
        .style("opacity", 0);

});

function convertTextToNumbers(d) {
    d.year = +d.year;
    d.value = +d.value;
    return d;
}