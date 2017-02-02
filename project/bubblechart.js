function drawBubblechart() {

  var diameter = 500;


  var bubble = d3.layout.pack()
      .sort(function(a, b) {
          return -(a.value - b.value);
      })
      .size([diameter, diameter])
      .padding(1.5);

  var svg = d3.select("#bubblechart")
      .append("svg")
      .attr("width", diameter + 400)
      .attr("height", diameter + 100)
      .attr("class", "bubble");


          var legend = svg.append("g")
            .attr("class", "legend")
            .selectAll("g")
            .data(groups)
            .enter()
            .append("g")
            .attr('transform', function(d, i) {
              var height = legendRectSize;
              var x = 0;
              var y = i * height + 180;
              return 'translate(' + x + ',' + y + ')';
            })

  d3.csv("data/groupsize.csv", function(error, data){
    if (error) throw error;

    data = data.map(function(d){ d.value = +d.groupsize; return d; });



    //bubbles needs very specific format, convert data to this.
    var nodes = bubble.nodes({children:data}).filter(function(d) { return !d.children; });


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
    .size([diameter - 4, diameter - 4])
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
        .attr("class", "bubbel")
        .attr("id", function(d){ return d.bird.toUpperCase().replace(/\W/g, ''); })

        .style("fill", function(d) { return paletteScale(d.group); });

  }








  function forceup() {
    var force = d3.layout.force()
        .nodes(nodes)
        .gravity(0.03)
        .charge(0)
        .size([diameter, diameter])
        .start();

    var drag = force.drag().on("dragstart", function(d) {
      d3.select(this)
      .classed("hovered", true);



    });

    force.on("tick", function () {
      var q = d3.geom.quadtree(nodes);
      var i = 0;
      var n = nodes.length;

      while (++i < n) {
        q.visit(collide(nodes[i]));
      }

      svg.selectAll(".bubbel")
          .attr("cx", function (d) { return d.x + 80; })
          .attr("cy", function (d) { return d.y + 100; })
          .on("mouseover", function(d) {
                   tooltip.transition().duration(200).style("opacity", .9);
                   tooltip.html("<strong>" + d.bird + "</strong>" + "<br>" + "Groepsgrootte: " + d.groupsize)
                   .style("left", (d3.event.pageX) + "px")
                   .style("top", (d3.event.pageY - 28) + "px");

                   d3.select(this)
                   .classed("hovered", true);
               })
               .on("mouseout", function(d) {

                   tooltip.transition().duration(500).style("opacity", 0);

                   d3.select(this)
                   .classed("hovered", false);
               })
              .on("dblclick", function (d) {

                var birdLowercase = d.bird.replace(/\W/g, '');

                var birdUppercase = d.bird.toUpperCase().replace(/\W/g, '');


                d3.selectAll(".clicked")
                .classed("clicked", false);

                highlightBar(birdLowercase);
                highlightLine(birdUppercase);

                highlightCircle(birdUppercase);





                $('html, body').animate({
                  scrollTop: $("#linegraph").offset().top - 60
                }, 1000);

              });

    });

    d3.selectAll(".bubbel")
      .call(drag);

  }

  packup();
  forceup();



            legend.append("rect")
              .attr("width", legendRectSize)
              .attr("height", legendRectSize)
              .style("fill", function(d, i) {return paletteScale(groups[i])});

            legend.append("text")
              .attr("x", legendRectSize + legendSize)
              .attr('y', legendRectSize - legendSize)
              .text(function(d, i) { return groups[i]});




  });

}
