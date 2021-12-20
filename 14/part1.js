const polymer = require('./polymer.js');

function main() {
  polymer.load('./14/test.txt', (data) => {
    const ref = setInterval(() => {
      polymer.step();
      if (polymer.stepCount == 10) {
        clearInterval(ref);
        console.log('Number of steps: ' + (polymer.stepCount));
        console.log(polymer.charCount);
      }
    }, 100);
  });
}

main();
