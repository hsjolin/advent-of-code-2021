const map = require("./map.js");

main();

function main() {
  map.load('input.txt', () => {
    map.verifyData();
    console.log(map.part1());
  });
}
