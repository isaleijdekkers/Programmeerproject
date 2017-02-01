function drawLinegraph() {
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
      .classed("hovered", true);

})
      .on("mouseout", function(d) {
        tip.hide(d, y(d.name))

        d3.selectAll(".punt")
        .attr("r", 0)

        d3.selectAll(".textpunt")
        .style("font-size", "0px")


        d3.select(this)
        .classed("hovered", false);



        var input = document.getElementById("myInput").value;
        var filter = input.toUpperCase().replace(/\W/g, '');


       })
      .on("click", function(d) {
        var vogel = d.name.replace(/\W/g, '');


        d3.selectAll(".clicked")
        .classed("clicked", false);

        highlightBar(vogel);

        var vogel = d.name.toUpperCase().replace(/\W/g, '');
        highlightLine(vogel);
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

}
