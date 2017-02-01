function highlightLine(vogel) {

  var vogeltje = "path#" + vogel

  d3.selectAll(vogeltje)
  .classed("clicked", function (d,i) {
  return !d3.select(this).classed("clicked")
  });

}

function highlightCircle(vogel) {

  var vogeltje = "circle#" + vogel
  d3.selectAll(vogeltje)
  .classed("clicked", function (d,i) {
  return !d3.select(this).classed("clicked")
  });
}

function highlightBar(vogel) {

  var vogeltje = "rect#" + vogel
  d3.selectAll(vogeltje)
  .classed("clicked", function (d,i) {
  return !d3.select(this).classed("clicked")
  });
}

function myFunction() {





// Declare variables
  var input = document.getElementById("myInput").value;
  var filter = input.toUpperCase().replace(/\W/g, '');


  for (var i = 0; i < vogels.length; i++) {
    var vogelId = "#" + vogels[i].toUpperCase().replace(/\W/g, '');
    if (filter == 0) {
      d3.select(vogelId)
      .classed("searched", false);
    }
   else if (filter == (vogels[i].slice(0, input.length).toUpperCase().replace(/\W/g, ''))) {
        d3.select(vogelId)
        .classed("searched", true);

    }
    else {
      d3.select(vogelId)
      .classed("searched", false);
    }
  };

}

function clickButton() {

  d3.selectAll(".clicked")
  .classed("clicked", false);

  }
