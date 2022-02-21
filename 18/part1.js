const snailFish = require('./snailFish.js');

function main() {
  snailFish.load('./18/input.txt', (data) => {
    draw (data);
  });
}

function draw (data) {
  for (let number of data.numbers) {
    console.log(number);
  }
  data.run(counter => {
    console.log(counter + ': ' + data.sum);
  });
  console.log('Total magnitude: ' + data.magnitude());
}

main();
