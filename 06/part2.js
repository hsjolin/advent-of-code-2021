const utils = require("../utils/utils.js");
const seabed = require("./seabed.js");
const readFile = utils.readFile;

main();

async function main() {
  seabed.load('input.txt', async () => {
    for (let day = 0; day < 256; day++) {
      await seabed.tick();
    }

    console.log('Number of fishes after 256 days: ' + seabed.numberOfFishes);
  });
}
