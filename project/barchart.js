function drawBarchart(jaar) {
var jaar = "telling" + jaar.slice(-2);


  // set dimensions of canvas
  var margin = {top: 20, right: 20, bottom: 120, left: 55},
      width = 1000 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  // set ranges
  var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);


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
  });

// setup tip
svg.call(tip);

// load data
d3.csv("data/vogelsstaafdiagram.csv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
      vogels.push(d.vogel)
  });
  // scale range of data
  x.domain(data.map(function(d) { return d.vogel; }));
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
      .attr("id", function (d) { return d.vogel.replace(/\W/g, ''); })
      .attr("x", function(d) { return x(d.vogel); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d[jaar]); })
      .attr("height", function(d) { return height - y(d[jaar]); })
      // show tip when hovering over and hide tip when not
      .on("mouseover", function(d) {
        tip.show(d, y(d[jaar]));
      })
      .on("mouseout",
      function(d) {
        tip.hide(d, y(d[jaar]))
      })
      .on("click", function(d) {


        d3.selectAll(".clicked")
        .classed("clicked", false);

        var vogelKleineletter = d.vogel.replace(/\W/g, '');


        var vogelHoofdletter = d.vogel.toUpperCase().replace(/\W/g, '');

        highlightBar(vogelKleineletter);

          highlightLine(vogelHoofdletter);
          highlightCircle(vogelHoofdletter);

          $('html, body').animate({
            scrollTop: $("#linegraph").offset().top - 60
          }, 1000);
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
