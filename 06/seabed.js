const utils = require("../utils/utils.js");
const lineReader = utils.lineReader;
const fileWriter = utils.fileWriter;
const appendFile = utils.appendFile;
const replaceFile = utils.replaceFile;

var seabed = {
  numberOfFishes: 0,
  load: function(file, completeCallback) {
    lineReader(file, (line) => {
      }, lines => {
        fileWriter('fishes.txt', lines[0]);
        completeCallback();
      });
  },
  tick: async function() {
    this.numberOfFishes = 0;
    return new Promise(resolve => {
      lineReader('fishes.txt', line => {
        let fishes = [];
        const regex = /\d/g;
        let match;
        while (match = regex.exec(line)) {
          fishes.push(this.createFish(parseInt(match[0])));
        }

        fishes.forEach(fish => {
          fish.tick();
        });

        let fishesReadyToBreed = fishes.filter(fish => fish.canBreed());
        fishesReadyToBreed.forEach(fish => {
          fish.breed();
          fishes.push(this.createFish(8));
        });

        let lineSize = 1000000;
        for(let i = 0; i < fishes.length; i += lineSize) {
          appendFile('fishes.tmp',
            fishes
              .slice(i, i + lineSize)
              .map(fish => fish.breedTimer)
              .join() + '\r\n');
        }

        this.numberOfFishes += fishes.length;
      }, lines => {
        replaceFile('fishes.txt', 'fishes.tmp');
        resolve();
      });
    });
  },
  createFish(timer) {
    return {
      breedTimer: timer,
      tick: function() {
        this.breedTimer--;
      },
      breed: function() {
        this.breedTimer = 6;
      },
      canBreed: function() {
        return this.breedTimer < 0;
      }
    }
  }
}

module.exports = seabed;
