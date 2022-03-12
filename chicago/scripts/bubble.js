function bubbleChart() {
  console.log("bubbleChart being called!")
  var width = 1200;
  var height = 600;

  var tooltip = floatingTooltip('tooltip', 240);
  var center = { x: 470, y: height / 2 };

  var yearCenters = {
    5: { x: 160, y: 300 },
    4: { x: 315, y: 300 },
    3: { x: 470, y: 300 },
    2: { x: 625, y: 300 },
    1: { x: 780, y: 300 },
  };

  var yearsTitleX = {
    'Very Low': 100,
    'Low': 290,
    'Middle': 480,
    'High': 670,
    'Very High': 860,
  };

  var forceStrength = 0.025;

  var svg = null;
  var bubbles = null;
  var nodes = [];

  var yearToSplitOn = null;

  function charge(d) {
    return -Math.pow(d.radius, 2.0) * forceStrength;
  }

  var simulation = d3
    .forceSimulation()
    .velocityDecay(0.2)
    .force('x', d3.forceX().strength(forceStrength).x(center.x))
    .force('y', d3.forceY().strength(forceStrength).y(center.y))
    .force('charge', d3.forceManyBody().strength(charge))
    .on('tick', ticked);

  simulation.stop();

  var fillColor = d3
    .scaleOrdinal()
    .domain([3, 2, 1])
    .range(['#07286f', '#ce2c6b', '#ffa600']);

  function createNodes(rawData) {
    console.log(rawData);

    var maxAmount = d3.max(rawData, function (d) {
      return +d.AF2LE001;
    });

    var radiusScale = d3
      .scalePow()
      .exponent(0.5)
      .range([2, 14])
      .domain([0, maxAmount]);

    var myNodes = rawData.map(function (d) {
      return {
        id: d.id,
        radius: radiusScale(+d.AF2LE001),
        value: +d.AF2LE001,
        name: d.TRACTA,
        group: d.THREECITY,
        1970: d.INC1970,
        1980: d.INC1980,
        1990: d.INC1990,
        2000: d.INC2000,
        2010: d.INC2010,
        2016: d.INC2016,
        x: Math.random() * 1100,
        y: Math.random() * 700,
      };
    });

    myNodes.sort(function (a, b) {
      return b.value - a.value;
    });

    console.log('nodes', myNodes);

    return myNodes;
  }

  var chart = function chart(selector, rawData) {
    nodes = createNodes(rawData);

    svg = d3
      .select(selector)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('overflow', 'display');

    bubbles = svg.selectAll('.bubble').data(nodes, function (d) {
      return d.id;
    });

    var bubblesE = bubbles
      .enter()
      .append('circle')
      .classed('bubble', true)
      .attr('r', 0)
      .attr('fill', function (d) {
        return fillColor(d.group);
      })
      .attr('stroke', function (d) {
        return d3.rgb(fillColor(d.group)).darker();
      })
      .attr('stroke-width', 1)
      .on('mouseover', showDetail)
      .on('mouseout', hideDetail);

    bubbles = bubbles.merge(bubblesE);

    bubbles
      .transition()
      .duration(2000)
      .attr('r', function (d) {
        return d.radius;
      });

    simulation.nodes(nodes);

    groupBubbles();
  };

  function ticked() {
    bubbles
      .attr('cx', function (d) {
        return d.x;
      })
      .attr('cy', function (d) {
        return d.y;
      });
  }

  function nodeYearPos(d) {
    return yearCenters[d[yearToSplitOn]].x;
  }

  function groupBubbles() {
    hideYearTitles();

    simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));

    simulation.alpha(1).restart();
  }

  function splitBubbles(year) {
    yearToSplitOn = year;
    showYearTitles();

    simulation.force('x', d3.forceX().strength(forceStrength).x(nodeYearPos));

    simulation.alpha(1).restart();
  }

  function hideYearTitles() {
    svg.selectAll('.year').remove();
  }

  function showYearTitles() {
    var yearsData = d3.keys(yearsTitleX);
    var years = svg.selectAll('.year').data(yearsData);

    years
      .enter()
      .append('text')
      .attr('class', 'year')
      .attr('x', function (d) {
        return yearsTitleX[d];
      })
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .text(function (d) {
        return d;
      });
  }

  function showDetail(d) {
    d3.select(this).attr('stroke', 'black');

    var content =
      '<span class="name">Census Tract: </span><span class="value">' +
      d.name +
      '</span><br/>' +
      '<span class="name">Population: </span><span class="value">' +
      addCommas(d.value) +
      '</span><br/>';

    tooltip.showTooltip(content, d3.event);
  }

  function hideDetail(d) {
    d3.select(this).attr('stroke', d3.rgb(fillColor(d.group)).darker());

    tooltip.hideTooltip();
  }

  chart.toggleDisplay = function (displayName) {
    if (displayName === 'all') {
      groupBubbles();
    } else {
      splitBubbles(displayName);
    }
  };

  return chart;
}

var myBubbleChart = bubbleChart();

function display(error, data) {
  if (error) {
    console.log(error);
  }

  myBubbleChart('#vis', data);
}

function setupButtons() {
  d3.select('#toolbar')
    .selectAll('.button')
    .on('click', function () {
      d3.selectAll('.button').classed('active', false);

      var button = d3.select(this);

      button.classed('active', true);

      var buttonId = button.attr('id');
      console.log(buttonId);

      myBubbleChart.toggleDisplay(buttonId);
    });
}

function addCommas(nStr) {
  nStr += '';
  var x = nStr.split('.');
  var x1 = x[0];
  var x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }

  return x1 + x2;
}

d3.csv('data/dv_data_final.csv', display);

setupButtons();
