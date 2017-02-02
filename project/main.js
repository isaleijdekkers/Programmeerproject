// create array for all birds
var birds = [];

// create arrays with values and colors
groups = ["standvogel", "trekvogel", "beide"];
colors  = ["#2F4F4F", "#F4A460","#778899"];

// create color palette function
var paletteScale = d3.scale.ordinal()
                     .domain(groups)
                     .range(colors);

// set legendsizes
var legendRectSize = 18;
var legendSize = 4;

// set tooltip for bubbelchart
var tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

// draw the visualisations
drawTimeline();
drawLinegraph();
drawBubblechart();
