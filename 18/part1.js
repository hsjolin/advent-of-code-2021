const snailFish = require('./snailFish.js');
const interval = require('../utils/utils').interval;

function main() {
  snailFish.load('./18/test.txt', (data) => {
    draw (data);
  });
}

function draw (data) {
  for (let number of data.numbers) {
    console.log(numberToString(number));
  }
  data.run();
  console.log(numberToString(data.sum));
}

function numberToString(number) {
  let string = '[';
  if (isNaN(number.n1)) {
    string += numberToString(number.n1);
  } else {
    string += number.n1;
  }
  string += ',';
  if (isNaN(number.n2)) {
    string += numberToString(number.n2);
  } else {
    string += number.n2;
  }
  string += ']';

  return string;
}

main();
