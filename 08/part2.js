const display = require("./display.js");

main();

function main() {
  display.load('input.txt', () => {
    display.verifyData();
    console.log(display.part2());
  });
}
