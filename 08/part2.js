const display = require("./display.js");

main();

function main() {
  display.load('test.txt', () => {
    display.verifyData();
    // display.draw();
  });
}
