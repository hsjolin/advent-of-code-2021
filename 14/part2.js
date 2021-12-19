const polymer = require('./polymer.js');

function main() {
  polymer.load('./14/test.txt', (data) => {
    const ref = setInterval(() => {
      polymer.step();

      if (polymer.stepCount == 40) {
        clearInterval(ref);
        console.log('Number of steps: ' + (polymer.stepCount));
        console.log(polymer.count());
      }
    }, 100);
  });
}

main();
