d3.csv("data/income.csv", type, function (error, data) {

    var svg = d3.select("body").select("#chiBars")
    var bmargin = {top: 20, right: 60, bottom: 30, left: 135},
        bwidth = +svg.attr("bwidth") - bmargin.left - bmargin.right,
        bheight = +svg.attr("bheight") - bmargin.top - bmargin.bottom,
        bwidth = 450,
        bheight = 856,
        g = svg.append("g")
            .attr("transform", "translate(" + bmargin.left + "," + bmargin.top + ")");

    var y = d3.scaleBand()
        .rangeRound([0, bwidth])
        .padding(0.2)
        .align(0.1);

    var x = d3.scaleLinear()
        .rangeRound([bheight, 0]);

    var z = d3.scaleOrdinal()
        .range(['#ffa600', '#928A97', '#283C63 ']);

    var stack = d3.stack()
        .offset(d3.stackOffsetExpand);

    y.domain(data.map(function (d) {
        return d.Year;
    }));

    z.domain(data.columns.slice(1));

    var series = g.selectAll(".series")
        .data(stack.keys(data.columns.slice(1))(data))
        .enter().append("g")
        .attr("class", "series")
        .attr("fill", function (d) {
            return z(d.key);
        });

    var bar = series.selectAll("rect")
        .data(function (d) {
            return d;
        })
        .enter().append("rect")
        .attr("y", function (d) {
            return y(d.data.Year);
        })
        .attr("x", function (d) {
            return x(d[1]);
        })
        .attr("width", function (d) {
            return x(d[0]) - x(d[1]);
        })
        .attr("height", y.bandwidth());

    g.append("g")
        .attr("class", "bars-axis bars-axis--y")
        .style("stroke-width", 0)
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("class", "bars-barLabel")
        .attr("x", 290)
        .attr("y", 57.5)
        .text("42%")
        
    svg.append("text")
        .attr("class", "bars-barLabel")
        .attr("x", 686)
        .attr("y", 57.5)
        .text("50%")

    svg.append("text")
        .attr("class", "bars-barLabelB")
        .attr("x", 945.5)
        .attr("y", 57.5)
        .text("8%")

    svg.append("text")
        .attr("class", "bars-barLabel")
        .attr("x", 348)
        .attr("y", 128.5)
        .text("56%")
        
    svg.append("text")
        .attr("class", "bars-barLabel")
        .attr("x", 762)
        .attr("y", 128.5)
        .text("38%")

    svg.append("text")
        .attr("class", "bars-barLabelB")
        .attr("x", 953.5)
        .attr("y", 128.5)
        .text("6%")

    svg.append("text")
        .attr("class", "bars-barLabel")
        .attr("x", 355)
        .attr("y", 201)
        .text("58%")
        
    svg.append("text")
        .attr("class", "bars-barLabel")
        .attr("x", 750)
        .attr("y", 201)
        .text("33%")

    svg.append("text")
        .attr("class", "bars-barLabelB")
        .attr("x", 933)
        .attr("y", 201)
        .text("10%")

    svg.append("text")
        .attr("class", "bars-barLabel")
        .attr("x", 406)
        .attr("y", 273.5)
        .text("70%")
        
    svg.append("text")
        .attr("class", "bars-barLabel")
        .attr("x", 793)
        .attr("y", 273.5)
        .text("18%")

    svg.append("text")
        .attr("class", "bars-barLabelB")
        .attr("x", 924)
        .attr("y", 273.5)
        .text("12%")

    svg.append("text")
        .attr("class", "bars-barLabel")
        .attr("x", 355)
        .attr("y", 346)
        .text("62%")
        
    svg.append("text")
        .attr("class", "bars-barLabel")
        .attr("x", 724)
        .attr("y", 346)
        .text("18%")

    svg.append("text")
        .attr("class", "bars-barLabelB")
        .attr("x", 886.5)
        .attr("y", 346)
        .text("20%")
    
    svg.append("text")
        .attr("class", "bars-barLabel")
        .attr("x", 355)
        .attr("y", 418.5)
        .text("62%")
        
    svg.append("text")
        .attr("class", "bars-barLabel")
        .attr("x", 719)
        .attr("y", 418.5)
        .text("16%")

    svg.append("text")
        .attr("class", "bars-barLabelB")
        .attr("x", 875)
        .attr("y", 418.5)
        .text("22%")

});

function type(d, i, columns) {
    var t;
    for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    d.total = t;
    return d;
}