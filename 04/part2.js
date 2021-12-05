const utils = require("../utils/utils.js");

const lineReader = utils.lineReader;
const parseCommand = utils.parseCommand;
const subMarine = utils.getSubmarine();

main();

function main() {
  lineReader('input.txt', line => {
    const command = parseCommand(line);
    subMarine.executeCommand(command);
    console.log('x: ' + subMarine.xPos + ', depth: ' + subMarine.depth);
  }, (lines) => {
    console.log('Final position: x: ' + subMarine.xPos + ' depth: ' + subMarine.depth + ' x * depth: ' + subMarine.xPos * subMarine.depth);
  });
}
