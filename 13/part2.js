const paper = require('./paper.js');

function main() {
  paper.load('./13/input.txt', (data) => {
    let fold = paper;
    const ref = setInterval(() => {
      draw(fold);
      fold = fold.fold();
      if (fold == null) {
        clearInterval(ref);
      }
    }, 2000);
    
    draw(paper.fold());
  });
}

function draw (paper) {
  console.clear();
  const folds = paper.folds;
  const points = paper.points;
  const yMax = paper.height;
  const xMax = paper.width;
  console.log('Number of points: ' + points.length);
  for (let y = 0; y < yMax + 1; y++) {
    let line = '';
    let yFold = folds.find(f => f.axis == 'y' && f.position == y);

    for (let x = 0; x < xMax + 1; x++) {
      let point = points.find(p => p.x == x && p.y == y);
      let xFold = folds.find(f => f.axis == 'x' && f.position == x);

      if (point) {
        line += '#';
      } else if (yFold && xFold) {
        line += '+';
      } else if (yFold) {
        line += '-';
      } else if (xFold) {
        line += '|';
      } else {
        line += '.';
      }
    }

    console.log(line);
  }
}

main();
