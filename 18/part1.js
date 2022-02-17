const snailFish = require('./snailFish.js');
const interval = require('../utils/utils').interval;

function main() {
  snailFish.load('./18/input.txt', (data) => {
    draw (data);
  });
}

function draw (data) {
  for (let number of data.numbers) {
    console.log(numberToString(number));
  }
  data.run(counter => {
    console.log(counter + ' after ' + data.lastAction + ': ' + numberToString(data.sum));
  });
}

function numberToString(number) {
  let string = '[';
  if (isNaN(number.left)) {
    string += numberToString(number.left);
  } else {
    string += number.left;
  }
  string += ',';
  if (isNaN(number.right)) {
    string += numberToString(number.right);
  } else {
    string += number.right;
  }
  string += ']';

  return string;
}

main();
