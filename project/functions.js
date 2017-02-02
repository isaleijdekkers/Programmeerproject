function highlightLine(birdUppercase) {
  var bird = "path#" + birdUppercase;

  d3.selectAll(bird)
    .classed("clicked", function (d,i) {
    return !d3.select(this).classed("clicked")
    });
}

function highlightCircle(birdUppercase) {
  var bird = "circle#" + birdUppercase;

  d3.selectAll(bird)
  .classed("clicked", function (d,i) {
  return !d3.select(this).classed("clicked")
  });
}

function highlightBar(birdLowercase) {
  var bird = "rect#" + birdLowercase;

  d3.selectAll(bird)
  .classed("clicked", function (d,i) {
  return !d3.select(this).classed("clicked")
  });
}

function myFunction() {
  // Declare variables
  var input = document.getElementById("myInput").value;
  var filter = input.toUpperCase().replace(/\W/g, '');

  for (var i = 0; i < birds.length; i++) {
    var birdId = "#" + birds[i].toUpperCase().replace(/\W/g, '');
    if (filter == 0) {
      d3.select(birdId)
      .classed("searched", false);
    } else if (filter == (birds[i].slice(0, input.length).toUpperCase().replace(/\W/g, ''))) {
        d3.select(birdId)
        .classed("searched", true);
    } else {
      d3.select(birdId)
      .classed("searched", false);
    }
  };
}

function clickButton() {
  d3.selectAll(".clicked")
  .classed("clicked", false);
}
