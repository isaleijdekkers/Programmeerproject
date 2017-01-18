window.onload = function() {
(function() {
var margin = {top: 30, right: 40, bottom: 30, left: 50},
  width = 1200 - margin.left - margin.right,
  height = 50 - margin.top - margin.bottom;


var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

    var svg = d3.select("#timeline").append("svg")
                .attr("class", "plot")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var xAxis = d3.svg.axis().scale(x)
                    .orient("bottom").tickFormat(d3.format("d"));

var yAxis = d3.svg.axis()
              .scale(y)
              .orient("left");

var focus = svg.append("g")
               .style("display", "none");

// add d3-tip
var tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-10, 0])
            .html(function(d) {
            return "<span style='color:black'>" + d.tellingen + "<br>" + "deelnemers" + "</span>";
            });

// setup tip
svg.call(tip);

// load file
d3.csv("/data/aantaltellingen.csv", function(error, data) {
  if (error) throw error;
  // fill dataset in appropriate format
  data.forEach(function(d) {
      d.jaar = d.jaar
      d.tellingen = +d.tellingen
  });

    x.domain([2005, 2016]);

    // append x axis
    svg.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + height + ")")
       .call(xAxis)
       .append("text")
       .attr("x", 150)
       .attr("y", -18)
       .attr("dy", ".71em")
       .style("text-anchor", "end");

       // add dots
       svg.selectAll(".dot")
          .data(data)
          .enter().append("circle")
          .attr("class", "dot")
          .attr("r", 5)
          .attr("cx", function(d) { return x(d.jaar); })
          .attr("cy", -10)
          .style("fill", "#fc9272")
          .style("stroke", "black")
          // show tip when hovering over and hide tip when not
          .on("mouseover", function(d) {
            tip.show(d, y(d.tellingen))
             d3.select(this)
               .attr("r", 8); })
          .on("mouseout", function(d) {
            tip.hide(d, y(d.tellingen))
             d3.select(this)
            .attr("r", 5); })
          .on("click", function(d) {
          drawBarchart(d.jaar) });;
});
})();

function drawBarchart(jaar) {
  console.log("telling" + jaar.slice(-2))


  // set dimensions of canvas
  var margin = {top: 20, right: 20, bottom: 120, left: 50},
      width = 1200 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  // set ranges
  var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);

  // var y = d3.scale.linear().range([height, 0]);
  var y = d3.scale.log()
      .rangeRound([height, 0]);

  // add SVG element
  var svg = d3.select("#barchart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // define axis
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10);

// add d3-tip
  var tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
      return "<span style='color:black'>" + d[jaar] + "</span>";
  });

// setup tip
svg.call(tip);

// load data
d3.csv("/data/vogeltelling.csv", function(error, data) {
  data.forEach(function(d) {
    d.vogel = d.vogel;
    d.telling16 = +d.telling16;
  });
  // scale range of data
  x.domain(data.map(function(d) { return d.vogel; }));
  // y.domain([0, d3.max(data, function(d) { return d.telling16; })]);
  y.domain([.3, 300000]);

  // add x axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );

// add y axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 5)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Telling");

  // Add bar chart
  svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.vogel); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.telling16); })
      .attr("height", function(d) { return height - y(d.telling16); })
      // show tip when hovering over and hide tip when not
      .on("mouseover", function(d) { tip.show(d, y(d.telling16)); })
      .on("mouseout", tip.hide);

      d3.select("input").on("change", change);

  function change() {

    // Copy-on-write since tweens are evaluated after a delay.
    var x0 = x.domain(data.sort(this.checked
        ? function(a, b) { return b.telling16 - a.telling16; }
        : function(a, b) { return d3.ascending(a.vogel, b.vogel); })
        .map(function(d) { return d.vogel; }))
        .copy();
        console.log(x0);

    svg.selectAll(".bar")
        .sort(function(a, b) { return x0(a.vogel) - x0(b.vogel); });

    var transition = svg.transition().duration(750),
        delay = function(d, i) { return i * 20; };

    transition.selectAll(".bar")
        .delay(delay)
        .attr("x", function(d) { return x0(d.vogel); });

    transition.select(".x.axis")
        .call(xAxis)
        .selectAll("g")
        .delay(delay)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)" )
        .delay(delay);
   }

});

}

(function() {
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



})();

}
