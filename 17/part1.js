const decoder = require('./probe.js');
const interval = require('../utils/utils').interval;

function main() {
  decoder.load('./17/test.txt', (data) => {
    draw (data);
  });
}

function draw (data) {
  for (let y = data.yMax; y > data.yMin - 1; y--) {
    let row = '';
    for (let x = data.xMin; x < data.xMax + 1; x++) {
      row += data.map[y][x];
    }
    console.log(row + y);
  }

  console.log(interval(data.xMin, data.xMax + 1).map(n => n % 10).join(''));
}

main();
