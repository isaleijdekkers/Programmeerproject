var diameter = 500;
var color  = d3.scale.category20c();

var bubble = d3.layout.pack()
    .sort(function(a, b) {
        return -(a.value - b.value);
    })
    .size([diameter, diameter])
    .padding(1.5);

var svg = d3.select("#bubblechart")
    .append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

d3.csv("/data/groepsgrootte.csv", function(error, data){

  data = data.map(function(d){ d.value = +d["2012"]; return d; });
  console.log(data);

  //bubbles needs very specific format, convert data to this.
  var nodes = bubble.nodes({children:data}).filter(function(d) { return !d.children; });



function dblclick(d) {
  d3.select(this).classed("fixed", d.fixed = false);
}

function dragstart(d) {
  d3.select(this).classed("fixed", d.fixed = true);
}

function collide(node) {
  var r = node.r + 16;
  var nx1 = node.x - r;
  var nx2 = node.x + r;
  var ny1 = node.y - r;
  var ny2 = node.y + r;
  return function (quad, x1, y1, x2, y2) {
    if (quad.point && (quad.point !== node)) {
      var x = node.x - quad.point.x;
      var y = node.y - quad.point.y;
      var l = Math.sqrt(x * x + y * y);
      var npr = node.r + quad.point.r;
      if (l < npr) {
        l = (l - npr) / l * 0.5;
        x *= l;
        node.x -= x;
        y *= l;
        node.y -= y;
        quad.point.x += x;
        quad.point.y += y;
      }
    }
    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
  };
}

function packup() {
  var pack = d3.layout.pack()
  .size([width - 4, height - 4])
  .sort( function(a, b) {
      return -(a.value - b.value);
  })
  .value(function(d) { return d.size; });

  //setup the chart
  var bubbles = svg.append("g")
      .attr("transform", "translate(0,0)")
      .selectAll(".bubble")
      .data(nodes)
      .enter();

  //create the bubbles
  bubbles.append("circle")
      .attr("r", function(d){ return d.r; })
      .attr("cx", function(d){ return d.x; })
      .attr("cy", function(d){ return d.y; })
      .style("fill", function(d) { return color(d["2012"]); });

      //format the text for each bubble
      bubbles.append("text")
          .attr("x", function(d){ return d.x; })
          .attr("y", function(d){ return d.y + 5; })
          .attr("text-anchor", "middle")
          .text(function(d){ return d.vogel; })
          .style({
              "fill":"white",
              "font-family":"Helvetica Neue, Helvetica, Arial, san-serif",
              "font-size": "12px"
          });
}

function forceup() {
  var force = d3.layout.force()
      .nodes(nodes)
      .gravity(0.03)
      .charge(0)
      .size([width, height])
      .start();

  var drag = force.drag().on("dragstart", dragstart);

  force.on("tick", function () {
    var q = d3.geom.quadtree(nodes);
    var i = 0;
    var n = nodes.length;

    while (++i < n) {
      q.visit(collide(nodes[i]));
    }

    svg.selectAll("circle")
        .attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; });
  });

  d3.selectAll("circle")
    .call(drag);
}

packup();
forceup();

});

(function() {

var diameter = 700;
var color    = d3.scale.category20c();
 //color category

    // // create arrays with values and colors
    // values = [2, 3, 4, 5, 6, 7, 8]
    // colors = ["#fee5d9", "#fcbba1", "#fc9272", "#fb6a4a","#de2d26", "#a50f15"]
    //
    // // create color palette function
    // var paletteScale = d3.scale.quantize()
    //                   .domain(values)
    //                   .range(colors);

var bubble = d3.layout.pack()
    // .sort(function(a, b) {
    //     return -(a.value - b.value);
    // })
    //
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);

    // var pack = d3.layout.pack()
    // .size([diameter - 4, diameter - 4])
    // .sort( function(a, b) {
    //     return -(a.value - b.value);
    // })
    // .value(function(d) { return d.size; });

var svg = d3.select("#bubblechart")
    .append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

d3.csv("/data/groepsgrootte.csv", function(error, data){

    //convert numerical values from strings to numbers
    data = data.map(function(d){ d.value = +d["2012"]; return d; });
    console.log(data);

    //bubbles needs very specific format, convert data to this.
    var nodes = bubble.nodes({children:data}).filter(function(d) { return !d.children; });

    //setup the chart
    var bubbles = svg.append("g")
        .attr("transform", "translate(0,0)")
        .selectAll(".bubble")
        .data(nodes)
        .enter();

    //create the bubbles
    bubbles.append("circle")
        .attr("r", function(d){ return d.r; })
        .attr("cx", function(d){ return d.x; })
        .attr("cy", function(d){ return d.y; })
        .style("fill", function(d) { return color(d["2012"]); });

    //format the text for each bubble
    bubbles.append("text")
        .attr("x", function(d){ return d.x; })
        .attr("y", function(d){ return d.y + 5; })
        .attr("text-anchor", "middle")
        .text(function(d){ return d.vogel; })
        .style({
            "fill":"white",
            "font-family":"Helvetica Neue, Helvetica, Arial, san-serif",
            "font-size": "12px"
        });

    });

})();
