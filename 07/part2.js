const crabfishSubmarines = require("./crabs2.js");

main();

function main() {
  crabfishSubmarines.load('input.txt', () => {
    const result = crabfishSubmarines.calculate();
    console.log('Cheapest possible outcome: ' + result.points + ' at position ' + result.position);
  });
}
