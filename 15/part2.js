const polymer = require('./polymer.js');

function main() {
  polymer.load('./14/input.txt', (data) => {
    const ref = setInterval(() => {
      polymer.step();
      console.log(polymer.stepCount);

      if (polymer.stepCount == 40) {
        clearInterval(ref);
        console.log('Number of steps: ' + (polymer.stepCount));
        console.log(polymer.count());
      }
    }, 1);
  });
}

main();
