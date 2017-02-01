var vogels = [];
var globalData;
// create arrays with values and colors
values = ["standvogel", "trekvogel", "beide"]
color  = ["#2F4F4F", "#F4A460","#778899"];


// create color palette function
var paletteScale = d3.scale.ordinal()
                  .domain(values)
                  .range(color);

drawTimeline()
drawLinegraph()
drawBubblechart()
