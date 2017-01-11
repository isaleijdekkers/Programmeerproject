window.onload = function() {

var margin = {top: 30, right: 40, bottom: 30, left: 50},
  width = 1230 - margin.left - margin.right,
  height = 50 - margin.top - margin.bottom;


var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").tickFormat(d3.format("d"));

    var svg = d3.select("body").append("svg")
                .attr("class", "plot")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xAxis = d3.svg.axis()
              .scale(x)
              .orient("bottom").tickFormat(d3.format("d"));;

var yAxis = d3.svg.axis()
              .scale(y)
              .orient("left");

// add d3-tip
var tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-10, 50])
            .html(function(d) {
            return "<span style='color:black'>" + d.tellingen + "</span>";
            });

// setup tip
svg.call(tip);

var focus = svg.append("g")
               .style("display", "none");

               // create tooltip
               var div = d3.select("body").append("div")
                           .attr("class", "tooltip")
                           .style("opacity", 0);

// load file
d3.csv("aantaltellingen.csv", function(error, data) {
  if (error) throw error;
  // fill dataset in appropriate format
  data.forEach(function(d) {
      d.jaar = d.jaar
      d.tellingen = d.tellingen
      console.log(d.tellingen);
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

  // create circles
  focus.append("circle")
       .attr("class", "y1")
       .style("fill", "red")
       .style("stroke", "black")
       .attr("r", 4);

       focus.append("text")
            .attr("class", "y1")
            .attr("dx", -10)
            .attr("dy", -13);

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
          // show tooltip on mousehover
          .on("mouseover", function(d) {
            div.transition()
               .duration(100)
               .style("opacity", .9);
             // change color and size dot on mousehover
             d3.select(this)
               .attr("r", 8);
            // create tooltip
            div.html("Aantal tellingen: " + "<br/>" + d.tellingen)
               .style("left", (d3.event.pageX + 20) + "px")
               .style("top", (d3.event.pageY - 50) + "px");
           })
          // redo changes on mouseout
          .on("mouseout", function(d) {
              div.transition()
                  .duration(200)
                  .style("opacity", 0);
               d3.select(this)
                 .attr("r", 5)
                 .style("fill", "#fc9272");
           });
});

}
