/*
* Isa Leijdekkers
* 10606467
*/

function highlightBar(birdLowercase) {
  var bird = "rect#" + birdLowercase;

  // highlights bar
  d3.selectAll(bird)
  .classed("clicked", function (d,i) {
  return !d3.select(this).classed("clicked")
  });
}

function highlightLine(birdUppercase) {
  var bird = "path#" + birdUppercase;

  // highlights line
  d3.selectAll(bird)
    .classed("clicked", function (d,i) {
    return !d3.select(this).classed("clicked")
    });
}

function highlightBubble(birdUppercase) {
  var bird = "circle#" + birdUppercase;

  // highlights bubble
  d3.selectAll(bird)
  .classed("clicked", function (d,i) {
  return !d3.select(this).classed("clicked")
  });
}

function myFunction() {

  // get input in uppercase and without spaces
  var input = document.getElementById("myInput").value;
  var filter = input.toUpperCase().replace(/\W/g, '');

  // hightlight line when first letters matches input
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

  // deselect all birds
  d3.selectAll(".clicked")
  .classed("clicked", false);
}
