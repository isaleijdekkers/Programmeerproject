/*
* draws the barchart
* barchart.js
* Isa Leijdekkers
* 10606467
*/

function drawBarchart(year) {
  var year = 'count' + year.slice(-2);

  // set dimensions of canvas
  var margin = {top: 20, right: 20, bottom: 120, left: 55},
      width = 1000 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  // set ranges
  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var y = d3.scale.log()
      .rangeRound([height, 0]);

  // add SVG element
  var svg = d3.select('#barchart').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // define axis
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom');

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .ticks(10)
      .tickFormat(function (d) {
        return y.tickFormat(4,d3.format(',d'))(d);
      });

  // add d3-tip
  var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
      return '<span style="color:black">' + d[year] + '</span>';
      });

  // setup tip
  svg.call(tip);

  // load data
  d3.csv('data/birdsbarchart.csv', function(error, data) {

    // throw error if error
    if (error) throw error;

    // push birdnames in array
    data.forEach(function(d) {
      birds.push(d.bird);
    });

    // scale range of data
    x.domain(data.map(function(d) { return d.bird; }));
    y.domain([.3, 300000]);

    // add x axis
    svg.append('g')
       .attr('class', 'x axis')
       .attr('transform', 'translate(0,' + height + ')')
       .call(xAxis)
       .selectAll('text')
       .style('text-anchor', 'end')
       .attr('dx', '-.8em')
       .attr('dy', '-.55em')
       .attr('transform', 'rotate(-90)');

    // add y axis
    svg.append('g')
       .attr('class', 'y axis')
       .call(yAxis)
       .append('text')
       .attr('transform', 'rotate(-90)')
       .attr('y', 5)
       .attr('dy', '.71em')
       .style('text-anchor', 'end')
       .text('Aantal keer geteld');

    // add bars
    // show tip on mouse hover
    // highlight bird in all graphs on click
    // scroll to next graph on click
    svg.selectAll('.bar')
       .data(data)
       .enter()
       .append('rect')
       .attr('class', 'bar')
       .attr('id', function (d) { return d.bird.replace(/\W/g, ''); })
       .attr('x', function(d) { return x(d.bird); })
       .attr('width', x.rangeBand())
       .attr('y', function(d) { return y(d[year]); })
       .attr('height', function(d) { return height - y(d[year]); })
       .on('mouseover', function(d) {
         tip.show(d, y(d[year]));
       })
       .on('mouseout', function(d) {
         tip.hide(d, y(d[year]));
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
           scrollTop: $('#linegraph').offset().top - 110
          }, 1000);

       });

    d3.select('input').on('change', change);

    function change(d) {

      // copy-on-write since tweens are evaluated after a delay
      var x0 = x.domain(data.sort(this.checked
        ? function(a, b) { return b[year] - a[year]; }
        : function(a, b) { return d3.ascending(a.bird, b.bird); })
        .map(function(d) { return d.bird; }))
        .copy();

      var transition = svg.transition().duration(750),
          delay = function(d, i) { return i * 20; };

      svg.selectAll('.bar')
         .sort(function(a, b) { return x0(a.bird) - x0(b.bird); });

      // sort bars
      transition.selectAll('.bar')
                .delay(delay)
                .attr('x', function(d) { return x0(d.bird); });

      // sort birdnames
      transition.select('.x.axis')
                .call(xAxis)
                .selectAll('g')
                .delay(delay)
                .selectAll('text')
                .style('text-anchor', 'end')
                .attr('dx', '-.8em')
                .attr('dy', '-.55em')
                .attr('transform', 'rotate(-90)')
                .delay(delay);
    }

  });

}
