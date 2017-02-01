var vogels = [];
// create arrays with values and colors
values = ["standvogel", "trekvogel", "beide"]
color  = ["#2F4F4F", "#F4A460","#778899"];


// create color palette function
var paletteScale = d3.scale.ordinal()
                  .domain(values)
                  .range(color);

                  var legendRectSize = 18;
                  var legendSpacing = 4;
                  
                  var tooltip = d3.select("body").append("div")
                      .attr("class", "tooltip")
                      .style("opacity", 0);

drawTimeline()
drawLinegraph()
drawBubblechart()
