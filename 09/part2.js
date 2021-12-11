const map = require("./map.js");

main();

function main() {
  map.load('test.txt', () => {
    map.part2();
    map.draw();
  });
}
