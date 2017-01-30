var vogels = [];
var globalData;
window.onload = function() {
// create arrays with values and colors
values = ["standvogel", "trekvogel", "beide"]
color  = ["#2F4F4F", "#F4A460","#778899"];


// create color palette function
var paletteScale = d3.scale.ordinal()
                  .domain(values)
                  .range(color);

(function() {
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
            return "<span style='color:black'>" + d.tellingen + "<br>" + "deelnemers" + "</span>";
            });

// setup tip
svg.call(tip);

// load file
d3.csv("data/aantaltellingen.csv", function(error, data) {
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
          .attr("id", function(d) { return "circle" + d.jaar; })
          .attr("cx", function(d) { return x(d.jaar); })
          .attr("cy", -10)
          .style("fill", "darkgrey")
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
            document.getElementById("barchart")
            .innerHTML = " ";

            document.getElementById("title1")
            .innerHTML = " ";

            document.getElementById("checkbox").checked = false;

          drawBarchart(d.jaar)

          d3.selectAll(".dot")
          .style("fill", "darkgrey")
          .attr("r", 5);
          d3.select(this)
         .style("fill", "red");

         d3.select("#title1")
         .append("text")
         .text("Aantal getelde vogels per soort in " + d.jaar);

         $('html, body').animate({
           scrollTop: $("#barchart").offset().top - 150
         }, 1000);

        });

        d3.select("#circle2016")
        .style("fill", "red")

        // d3.select("#nodata")
        // .on("mouseover", function d)


      });
})();

function drawBarchart(jaar) {
var jaar = "telling" + jaar.slice(-2);


  // set dimensions of canvas
  var margin = {top: 20, right: 20, bottom: 120, left: 55},
      width = 1000 - margin.left - margin.right,
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
      .ticks(10)
      .tickFormat(function (d) {
        return y.tickFormat(4,d3.format(",d"))(d);
        });;

// add d3-tip
  var tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        return "<span style='color:black'>" + d[jaar] + "</span>";
      // return "<span style='color:black'>" + d[jaar] + "</span>";
  });

// setup tip
svg.call(tip);

// load data
d3.csv("data/tuinvogeltelling.csv", function(error, data) {

  data.forEach(function(d) {
      vogels.push(d.vogel)
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
      .text("Aantal keer geteld");

  // Add bar chart
  svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.vogel); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d[jaar]); })
      .attr("height", function(d) { return height - y(d[jaar]); })
      // show tip when hovering over and hide tip when not
      .on("mouseover", function(d) {
        tip.show(d, y(d[jaar]))
        var vogel = d.vogel.toUpperCase().replace(/\W/g, '');
        highlightLine(vogel);
      })
      .on("mouseout",
      function(d) {
        tip.hide(d, y(d[jaar]))
        var vogel = d.vogel.toUpperCase().replace(/\W/g, '');
          deHighlightLine(vogel);
      });
      d3.select("input").on("change", change);


  function change(d) {

    // Copy-on-write since tweens are evaluated after a delay.
    var x0 = x.domain(data.sort(this.checked
        ? function(a, b) { return b[jaar] - a[jaar]; }
        : function(a, b) { return d3.ascending(a.vogel, b.vogel); })
        .map(function(d) { return d.vogel; }))
        .copy();

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
  var margin = {top: 20, right: 55, bottom: 30, left: 55},
      width  = 1000 - margin.left - margin.right,
      height = 500  - margin.top  - margin.bottom;

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], -0.3);

      var y = d3.scale.log()
          .rangeRound([height, 0]);


  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(function (d) {
        return y.tickFormat(4,d3.format(",d"))(d);
        });

  var line = d3.svg.line()
      .x(function (d) { return x(d.label) + x.rangeBand() / 2; })
      .y(function (d) { return y(d.value); });


  var svg = d3.select("#linegraph").append("svg")
      .attr("width",  width  + margin.left + margin.right)
      .attr("height", height + margin.top  + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // add d3-tip
        var tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([15,470])
            .html(function(data) {
            return "<span style='color:black'>" + data.name + "</span>"
            });

      // setup tip
      svg.call(tip);

  d3.csv("data/testvogels.csv", function (error, data) {
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
    y.domain([.25, 250000]);

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
        .append("path")
        .attr("class", "series")
      .attr("id", function (d) { return d.name.toUpperCase().replace(/\W/g, ''); })
      .attr("d", function (d) { return line(d.values); })
      .style("stroke", "lightgrey")
      .style("stroke-width", "1.5px")
      .style("fill", "none")
      .on("mouseover", function(d) {
        tip.show(d, y(d.name))
        currentName = d.name;
        d3.selectAll(".punt")
        .data(data)
        .attr("r", 3)
        .attr("cy", function(d, i) {return y(data[i][currentName]); })

        d3.selectAll(".textpunt")
        .data(data)
        .attr("dy", function(d, i) { return y(data[i][currentName]) - 15; })
        .text(function(d, i) { return (data[i][currentName]) })
        .style("font-size", "11px")

      d3.select(this)
        .style("stroke", "darkslategray")
        .style("stroke-width", "3px")
})
      .on("mouseout", function(d) {
        tip.hide(d, y(d.name))

        d3.selectAll(".punt")
        .attr("r", 0)

        d3.selectAll(".textpunt")
        .style("font-size", "0px")

        console.log(this)

      d3.select(this)
        .style("stroke", "lightgrey")
        .style("stroke-width", "1.5px")

        var input = document.getElementById("myInput").value;
        var filter = input.toUpperCase().replace(/\W/g, '');

        for (var i = 0; i < vogels.length; i++) {
          var vogelId = "#" + vogels[i].toUpperCase().replace(/\W/g, '');
          if (filter == 0) {
            d3.select(vogelId)
            .style("stroke", "lightgrey")
            .style("stroke-width", "1.5px");
          }
           else if (filter == (vogels[i].slice(0, input.length).toUpperCase().replace(/\W/g, ''))) {
              d3.select(vogelId)
              .style("stroke", "darkslategray")
              .style("stroke-width", "3px");
           }
          else {
            d3.select(vogelId).style("stroke", "lightgrey").style("stroke-width", "1.5px");
          }
        };
      })
      .on("click", function(d) {
        var vogel = d.name.toUpperCase().replace(/\W/g, '');
        d3.selectAll(".bubbel")
        .style("stroke-width", "0px");
        highlightCircle(vogel);

        $('html, body').animate({
          scrollTop: $("#bubblechart").offset().top
        }, 1000);
      });

      var input = document.getElementById("myInput").value;
      var filter = input.toUpperCase().replace(/\W/g, '');


      // Add the circles
      svg.selectAll(".dot")
          .data(data)
        .enter().append("circle")
          .attr("r", 0)
          .attr("class", "punt")
          .attr("cx", function(d) { return x(d.jaar) + x.rangeBand() / 2; })
          .attr("cy", function(d) { return y(d["Huismus"]); });

      svg.selectAll(".dot")
      .data(data)
        .enter().append("text")
        .attr("class", "textpunt")
        .attr("dx", function(d) { return x(d.jaar) + x.rangeBand() / 2 - 11; })
        .attr("dy", function(d) { return y(d["Huismus"]); });


        });

        })();

        function highlightLine(vogel) {

          var vogeltje = "path#" + vogel

          d3.selectAll(vogeltje)
            .style("stroke", "darkslategray")
            .style("stroke-width", "3px");
        }

        function deHighlightLine(vogel) {

          var vogeltje = "path#" + vogel
          d3.selectAll(vogeltje)
            .style("stroke", "lightgrey")
            .style("stroke-width", "1.5px");
        }


(function() {

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

      var tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);

          var legendRectSize = 18;
          var legendSpacing = 4;

          var legend = svg.append("g")
            .attr("class", "legend")
            .selectAll("g")
            .data(values)
            .enter()
            .append("g")
            .attr('transform', function(d, i) {
              var height = legendRectSize;
              var x = 0;
              var y = i * height + 140;
              return 'translate(' + x + ',' + y + ')';
            })

  d3.csv("data/groepsgrootte.csv", function(error, data){

    data = data.map(function(d){ d.value = +d.groep; return d; });



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
        .attr("id", function(d){ return d.vogel.toUpperCase().replace(/\W/g, ''); })

        .style("fill", function(d) { return paletteScale(d.soort); });

        //format the text for each bubble
        // bubbles.append("text")
        //     .attr("x", function(d){ return d.x; })
        //     .attr("y", function(d){ return d.y + 5; })
        //     .attr("text-anchor", "middle")
        //     .text(function(d){ console.log(d.vogel); return d.vogel; })
        //     .style({
        //         "fill":"white",
        //         "font-family":"Helvetica Neue, Helvetica, Arial, san-serif",
        //         "font-size": "12px"
        //     });

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
      .style("stroke", "black")
      .style("stroke-width", "3px");

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
          .attr("cy", function (d) { return d.y + 70; })
          .on("mouseover", function(d) {
                   tooltip.transition().duration(200).style("opacity", .9);
                   tooltip.html("<strong>" + d.vogel + "</strong>" + "<br>" + "Groepsgrootte: " + d.groep)
                   .style("left", (d3.event.pageX) + "px")
                   .style("top", (d3.event.pageY - 28) + "px");

                   d3.select(this)
                   .style("stroke", "black")
                   .style("stroke-width", "3px");;
               })
               .on("mouseout", function(d) {
                //  var vogel = d.vogel.toUpperCase().replace(/\W/g, '');
                //  deHighlightLine(vogel);
                   tooltip.transition().duration(500).style("opacity", 0);

                   d3.selectAll(".bubbel")
                   .style("stroke-width", "0px")
               })
              .on("click", function (d) {

                var vogel = d.vogel.toUpperCase().replace(/\W/g, '');



                d3.selectAll(".series")
                .style("stroke", "lightgrey")
                .style("stroke-width", "1.5px");

                highlightLine(vogel);

                $('html, body').animate({
                  scrollTop: $("#linegraph").offset().top
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
              .style("fill", function(d, i) {return paletteScale(values[i])});

            legend.append("text")
              .attr("x", legendRectSize + legendSpacing)
              .attr('y', legendRectSize - legendSpacing)
              .text(function(d, i) { return values[i]});




  });

})();

function highlightCircle(vogel) {

  var vogel = "circle#" + vogel
  d3.selectAll(vogel)
  .style("stroke", "black")
  .style("stroke-width", "3px");
}



}

function myFunction() {





// Declare variables
  var input = document.getElementById("myInput").value;
  var filter = input.toUpperCase().replace(/\W/g, '');


  for (var i = 0; i < vogels.length; i++) {
    var vogelId = "#" + vogels[i].toUpperCase().replace(/\W/g, '');
    if (filter == 0) {
      d3.select(vogelId)
      .style("stroke", "lightgrey")
      .style("stroke-width", "1.5px");
    }
   else if (filter == (vogels[i].slice(0, input.length).toUpperCase().replace(/\W/g, ''))) {
        d3.select(vogelId)
        .style("stroke", "darkslategray")
        .style("stroke-width", "3px");
        // tooltipline.transition().duration(200).style("opacity", .9);
        // tooltipline.html(function (d) { return vogels[i] })
        // .attr("dx", 70)
        // .attr("dy", function(data) { return y(data[vogelId]); });
      //   .style("left", (d3.event.pageX - 34) + "px")
      // .style("top", (d3.event.pageY - 12) + "px");
        // tooltip.html(vogels[i].toUpperCase().replace(/\W/g, ''));
        console.log(vogelId)
        // tip.show(vogelId)





        // tip.show(vogelId);

    }
    else {
      d3.select(vogelId).style("stroke", "lightgrey").style("stroke-width", "1.5px");
    }
  };



}
