const map = require("./map.js");

main();

function main() {
  map.load('input.txt', () => {
    map.part2();
    map.draw();
  });
}
