const utils = require("../utils/utils.js");
const lineHandler = require("./lineHandler.js");
const readFile = utils.readFile;

main();

function main() {
  lineHandler.load('input.txt', () => {
    lineHandler.draw();
  });
}
