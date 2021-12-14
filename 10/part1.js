const parser = require("./parser.js");

main();

function main() {
  parser.load('./10/test.txt', () => {
    console.log(parser.part1());
  });
}
