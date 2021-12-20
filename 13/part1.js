const paper = require('./paper.js');

function main() {
  paper.load('./13/input.txt', (data) => {
    draw(paper.fold());
  });
}

function draw (paper) {
  console.log(paper.points.length);
}

main();
