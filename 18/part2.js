const snailFish = require('./snailFish.js');

function main() {
  snailFish.load('./18/input.txt', (data) => {
    draw (data);
  });
}

function draw (data) {
  const numbers = [...data.numbers];
  let highestMagnitude = 0;
  for (let number1 of numbers) {
    for (let number2 of numbers) {
      if (number1 == number2) {
        continue;
      }

      snailFish.numbers = [number1, number2];
      snailFish.sum = number1;
      snailFish.run(c => {});
      const magnitude1 = snailFish.magnitude();
      console.log(number1 + ' + ' + number2 + ' => magnitude: ' + magnitude1);
      if (highestMagnitude < magnitude1) {
        highestMagnitude = magnitude1;
      }

      snailFish.numbers = [number2, number1];
      snailFish.sum = number2;
      snailFish.run(c => {});
      const magnitude2 = snailFish.magnitude();
      console.log(number2 + ' + ' + number1 + ' => magnitude: ' + magnitude2);
      if (highestMagnitude < magnitude2) {
        highestMagnitude = magnitude2;
      }
    }
  }

  console.log('Highest magnitude: ' + highestMagnitude);
}

main();
