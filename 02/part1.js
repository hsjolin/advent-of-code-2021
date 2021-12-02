const lineReader = require("./utils.js").lineReader

main();

function main() {
  let xPos = 0;
  let depth = 0;
  const cmdRegex = /^([a-z]+)\s([\d]+)$/

  lineReader('input.txt', line => {
    const matches = line.match(cmdRegex);
    const command = matches[1];
    const amount = parseInt(matches[2]);
    switch (command) {
      case 'forward': xPos += amount; break;
      case 'up': depth -= amount; break;
      case 'down': depth += amount; break;
      default: throw { message: 'WTF!? ' + command }
    }

    console.log('x: ' + xPos + ', depth: ' + depth);
  }, (lines) => {
    console.log('Final position: x: ' + xPos + ' depth: ' + depth + ' x * depth: ' + xPos * depth);
  });
}
