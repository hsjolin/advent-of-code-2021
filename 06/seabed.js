const utils = require("../utils/utils.js");
const fishStorage = require("./fishStorage.js");
const lineReader = utils.lineReader;

var seabed = {
  numberOfFishes: function() { return fishStorage.storageCount; },
  load: function(file, completeCallback) {
    lineReader(file, (line) => {
      }, lines => {
        let fishes = [];
        const regex = /\d/g;
        let match;
        while (match = regex.exec(lines[0])) {
          fishStorage.push(parseInt(match[0]));
        }

        fishStorage.commit();
        console.log('Loaded ' + fishStorage.storageCount + ' fishes');
        completeCallback();
      });
  },
  tick: function() {
    let breedTimer = fishStorage.pop();
    while(breedTimer != null) {
      let fish = this.createFish(breedTimer);
      fish.tick();
      if (fish.canBreed()) {
        fish.breed();
        fishStorage.push(8);
      }

      fishStorage.push(fish.breedTimer);
      breedTimer = fishStorage.pop();
    }
    fishStorage.commit();
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
