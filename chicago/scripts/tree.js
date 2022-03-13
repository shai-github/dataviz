var el_id = 'tree';
var obj = document.getElementById(el_id);
// var divWidth = obj.offsetWidth;
var divWidth = 920;
var tmargin = {top: 40, right: 20, bottom: 00, left: 20},
    twidth = divWidth - 25,
    theight = 600 - tmargin.top - tmargin.bottom,
    formatNumber = d3.format(","),
    transitioning;
var x = d3.scaleLinear()
    .domain([0, twidth])
    .range([0, twidth]);
var y = d3.scaleLinear()
    .domain([0, theight])
    .range([0, theight]);
var treemap = d3.treemap()
        .size([twidth, theight])
        .paddingInner(0)
        .round(false);
var svg = d3.select('#'+el_id).append("svg")
    .attr("width", twidth + tmargin.left + tmargin.right)
    .attr("height", theight + tmargin.bottom + tmargin.top)
    .style("margin-left", -tmargin.left + "px")
    .style("margin.right", -tmargin.right + "px")
    .append("g")
        .attr("transform", "translate(" + tmargin.left + "," + tmargin.top + ")")
        .style("shape-rendering", "crispEdges");
var grandparent = svg.append("g")
        .attr("class", "grandparent");
    grandparent.append("rect")
        .attr("y", -tmargin.top)
        .attr("width", twidth)
        .attr("height", tmargin.top)
        .attr("fill", '#bbbbbb');
    grandparent.append("text")
        .attr("x", 6)
        .attr("y", 6 - tmargin.top)
        .attr("dy", ".75em");
d3.json("data/tree.json", function(data) {
    var root = d3.hierarchy(data);
    console.log(root);
    treemap(root
        .sum(function (d) {
            return d.value;
        })
        .sort(function (a, b) {
            return b.theight - a.theight || b.value - a.value
        })
    );
    display(root);
    function display(d) {

        grandparent
            .datum(d.parent)
            .on("click", transition)
            .select("text")
            .text(name(d));

        grandparent
            .datum(d.parent)
            .select("rect")
            .attr("fill", function () {
                return '#ffffff'
            });
        var g1 = svg.insert("g", ".grandparent")
            .datum(d)
            .attr("class", "depth");
        var g = g1.selectAll("g")
            .data(d.children)
            .enter().
            append("g");

        g.filter(function (d) {
            return d.children;
        })
            .classed("children", true)
            .on("click", transition);
        g.selectAll(".child")
            .data(function (d) {
                return d.children || [d];
            })
            .enter().append("rect")
            .attr("class", "child")
            .call(rect);

        g.append("rect")
            .attr("class", "parent")
            .call(rect)
            .append("title")
            .text(function (d){
                return d.data.name;
            });

        g.append("foreignObject")
            .call(rect)
            .attr("class", "foreignobj")
            .append("xhtml:div")
            .attr("dy", ".75em")
            .html(function (d) {
                var fontStyle = '';
                if(d.data.name == "City Three") {
                    fontStyle = ' style="color:white;"';
                }
                return '' +
                    '<p class="title" ' + fontStyle + '>' + d.data.name + '</p>' +
                    '<p' + fontStyle + '>' + formatNumber(d.value) + '</p>'
                ;
            })
            .attr("class", "textdiv"); 
        function transition(d) {
            if (transitioning || !d) return;
            transitioning = true;
            var g2 = display(d),
                t1 = g1.transition().duration(650),
                t2 = g2.transition().duration(650);

            x.domain([d.x0, d.x1]);
            y.domain([d.y0, d.y1]);

            svg.style("shape-rendering", null);

            svg.selectAll(".depth").sort(function (a, b) {
                return a.depth - b.depth;
            });

            g2.selectAll("text").style("fill-opacity", 0);
            g2.selectAll("foreignObject div").style("display", "none");

            t1.selectAll("text").call(text).style("fill-opacity", 0);
            t2.selectAll("text").call(text).style("fill-opacity", 1);
            t1.selectAll("rect").call(rect);
            t2.selectAll("rect").call(rect);

            t1.selectAll(".textdiv").style("display", "none");

            t1.selectAll(".foreignobj").call(foreign);

            t2.selectAll(".textdiv").style("display", "block");

            t2.selectAll(".foreignobj").call(foreign);

            t1.on("end.remove", function(){
                this.remove();
                transitioning = false;
            });
        }
        return g;
    }
    function text(text) {
        text.attr("x", function (d) {
            return x(d.x) + 6;
        })
            .attr("y", function (d) {
                return y(d.y) + 6;
            });
    }
    function rect(rect) {
        rect
            .attr("x", function (d) {
                return x(d.x0);
            })
            .attr("y", function (d) {
                return y(d.y0);
            })
            .attr("width", function (d) {
                return x(d.x1) - x(d.x0);
            })
            .attr("height", function (d) {
                return y(d.y1) - y(d.y0);
            })
            .attr('fill', function(d){ return d.data.color; })
    }
    function foreign(foreign) {
        foreign
            .attr("x", function (d) {
                return x(d.x0);
            })
            .attr("y", function (d) {
                return y(d.y0);
            })
            .attr("width", function (d) {
                return x(d.x1) - x(d.x0);
            })
            .attr("height", function (d) {
                return y(d.y1) - y(d.y0);
            });
    }
    function name(d) {
        return breadcrumbs(d) +
            (d.parent
            ? " (click here to zoom out)"
            : " (click inside rectangle to zoom in)");
    }
    function breadcrumbs(d) {
        var res = "";
        var sep = " / ";
        d.ancestors().reverse().forEach(function(i){
            res += i.data.name + sep;
        });
        return res
            .split(sep)
            .filter(function(i){
                return i!== "";
            })
            .join(sep);
    }
});