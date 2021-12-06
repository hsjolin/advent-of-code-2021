const utils = require("../utils/utils.js");
const seabed = require("./seabed.js");
const readFile = utils.readFile;

main();

function main() {
  seabed.load('input.txt', () => {
    for (let day = 0; day < 80; day++) {
      seabed.tick();
    }

    console.log('Number of fishes after 80 days: ' + seabed.numberOfFishes());
  });
}
