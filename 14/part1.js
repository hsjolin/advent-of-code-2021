const polymer = require('./polymer.js');

function main() {
  polymer.load('./14/input.txt', (data) => {
    const ref = setInterval(() => {
      console.log(polymer.step());
      if (polymer.results.length == 11) {
        clearInterval(ref);
        console.log('Number of steps: ' + (polymer.results.length - 1));
        console.log(polymer.count());
      }
    }, 1000);
  });
}

main();
