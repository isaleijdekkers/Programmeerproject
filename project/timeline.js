function drawTimeline() {
var margin = {top: 30, right: 40, bottom: 30, left: 50},
  width = 1000 - margin.left - margin.right,
  height = 50 - margin.top - margin.bottom;

  drawBarchart("2016");


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
            return "<span style='color:black'>" + d.count + "<br>" + "deelnemers" + "</span>";
            });

// setup tip
svg.call(tip);

// load file
d3.csv("data/countings.csv", function(error, data) {
  if (error) throw error;
  // fill dataset in appropriate format
  data.forEach(function(d) {
      d.year = d.year
      d.count = +d.count
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
          .attr("id", function(d) { return "circle" + d.year; })
          .attr("cx", function(d) { return x(d.year); })
          .attr("cy", -10)
          .style("fill", "darkgrey")
          .style("stroke", "black")
          // show tip when hovering over and hide tip when not
          .on("mouseover", function(d) {
            tip.show(d, y(d.count))
             d3.select(this)
               .attr("r", 8); })
          .on("mouseout", function(d) {
            tip.hide(d, y(d.count))
             d3.select(this)
            .attr("r", 5); })
          .on("click", function(d) {
            document.getElementById("barchart")
            .innerHTML = " ";

            document.getElementById("title1")
            .innerHTML = " ";

            document.getElementById("checkbox").checked = false;

          drawBarchart(d.year)

          d3.selectAll(".dot")
          .style("fill", "darkgrey")
          .attr("r", 5);
          d3.select(this)
         .style("fill", "red");

         d3.select("#title1")
         .append("text")
         .text("Aantal getelde vogels per soort in " + d.year);

         $('html, body').animate({
           scrollTop: $("#barchart").offset().top - 150
         }, 1000);

        });

        d3.select("#circle2016")
        .style("fill", "red")
      });
}
