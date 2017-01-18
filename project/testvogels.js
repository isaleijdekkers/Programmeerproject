var margin = {top: 20, right: 55, bottom: 30, left: 40},
    width  = 1000 - margin.left - margin.right,
    height = 500  - margin.top  - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], -.9);

    var y = d3.scale.log()
        .rangeRound([height, 0]);


var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function (d) { return x(d.label) + x.rangeBand() / 2; })
    .y(function (d) { return y(d.value); });


var svg = d3.select("#linegraph").append("svg")
    .attr("width",  width  + margin.left + margin.right)
    .attr("height", height + margin.top  + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("/data/testvogels.csv", function (error, data) {
  var labelVar = 'jaar';
  var varNames = d3.keys(data[0]).filter(function (key) { return key !== labelVar;});

  var seriesData = varNames.map(function (name) {
    return {
      name: name,
      values: data.map(function (d) {
        return {name: name, label: d[labelVar], value: +d[name]};
      })
    };
  });
  x.domain(data.map(function (d) { return d.jaar; }));
  y.domain([.3, 300000]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Aantal keer geteld");

  svg.selectAll(".series")
      .data(seriesData)
    .enter().append("g")
      .attr("class", "series")
      .append("path")
    .attr("class", "line")
    .attr("d", function (d) { return line(d.values); })
    .style("stroke", "lightgrey")
    .style("stroke-width", "2px")
    .style("fill", "none")
    .on("mouseover", function(d) {
       d3.select(this)
         .style("stroke", "forestgreen")
         .style("stroke-width", "3px"); })
         .on("mouseout", function(d) {
            d3.select(this)
              .style("stroke", "lightgrey")
              .style("stroke-width", "2px"); });

    });
