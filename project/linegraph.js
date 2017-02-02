/*
* draws the linegraph
* linegraph.js
* Isa Leijdekkers
* 10606467
*/


function drawLinegraph() {

  // set dimensions of canvas
  var margin = {top: 20, right: 55, bottom: 30, left: 55},
      width  = 1000 - margin.left - margin.right,
      height = 500  - margin.top  - margin.bottom;

  // set ranges
  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], - 0.3);

  var y = d3.scale.log()
      .rangeRound([height, 0]);

  // define axis
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom');

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .tickFormat(function (d) {
        return y.tickFormat(4,d3.format(',d'))(d);
      });

  // declare line
  var line = d3.svg.line()
      .x(function (d) { return x(d.label) + x.rangeBand() / 2; })
      .y(function (d) { return y(d.value); });

  // add SVG element
  var svg = d3.select('#linegraph').append('svg')
      .attr('width',  width  + margin.left + margin.right)
      .attr('height', height + margin.top  + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // add d3-tip
  var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([15,470])
      .html(function(data) {
        return '<span style="color:black">' + data.bird + '</span>'
      });

  // setup tip
  svg.call(tip);

  // load data
  d3.csv('data/birdslinegraph.csv', function (error, data) {

    // throw error if error
    if (error) throw error;

    // fill dataset in appropriate format
    var label = 'year';
    var names = d3.keys(data[0]).filter(function (key) { return key !== label; });

    var lineData = names.map(function (bird) {
      return {
        bird: bird,
        values: data.map(function (d) {
          return {bird: bird, label: d[label], value: +d[bird]};
        })
      };
    });

    // scale range of data
    x.domain(data.map(function (d) { return d.year; }));
    y.domain([.25, 250000]);

    // add x axis
    svg.append('g')
       .attr('class', 'x axis')
       .attr('transform', 'translate(0,' + height + ')')
       .call(xAxis);

    // add y axis
    svg.append('g')
       .attr('class', 'y axis')
       .call(yAxis)
       .append('text')
       .attr('transform', 'rotate(-90)')
       .attr('y', 6)
       .attr('dy', '.71em')
       .style('text-anchor', 'end')
       .text('Aantal keer geteld');

    // add lines
    // show points, values and name on mouse hover
    // highlight bird in all graphs on click
    // scroll to next graph on click
    svg.selectAll('.line')
       .data(lineData)
       .enter().append('g')
       .append('path')
       .attr('class', 'line')
       .attr('id', function (d) { return d.bird.toUpperCase().replace(/\W/g, ''); })
       .attr('d', function (d) { return line(d.values); })
       .on('mouseover', function(d) {
         tip.show(d, y(d.bird));
         birdName = d.bird;

         d3.selectAll('.point')
           .data(data)
           .attr('r', 3)
           .attr('cy', function(d, i) {return y(data[i][birdName]); });

         d3.selectAll('.value')
           .data(data)
           .attr('dy', function(d, i) { return y(data[i][birdName]) - 15; })
           .text(function(d, i) { return (data[i][birdName]) })
           .style('font-size', '11px');

         d3.select(this)
           .classed('hovered', true);
       })
       .on('mouseout', function(d) {
         tip.hide(d, y(d.bird));

         d3.selectAll('.point')
           .attr('r', 0);

         d3.selectAll('.value')
           .style('font-size', '0px');

         d3.select(this)
           .classed('hovered', false);
       })
       .on('click', function(d) {
         var birdLowercase = d.bird.replace(/\W/g, '');
         var birdUppercase = d.bird.toUpperCase().replace(/\W/g, '');

         d3.selectAll('.clicked')
           .classed('clicked', false);

         highlightBar(birdLowercase);
         highlightLine(birdUppercase);
         highlightBubble(birdUppercase);

         $('html, body').animate({
           scrollTop: $('#bubblechart').offset().top
         }, 1000);
       });

    // add the circles
    svg.selectAll('.dot')
       .data(data)
       .enter().append('circle')
       .attr('r', 0)
       .attr('class', 'point')
       .attr('cx', function(d) { return x(d.year) + x.rangeBand() / 2; })
       .attr('cy', function(d) { return y(d['Huismus']); });

    // add the values
    svg.selectAll('.dot')
       .data(data)
       .enter().append('text')
       .attr('class', 'value')
       .attr('dx', function(d) { return x(d.year) + x.rangeBand() / 2 - 11; })
       .attr('dy', function(d) { return y(d['Huismus']); });
  });

}
