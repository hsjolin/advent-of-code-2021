const utils = require("../utils/utils.js");
const fishStorage = require("./fishStorage.js");
const lineReader = utils.lineReader;

var seabed = {
  numberOfFishes: function() { return fishStorage.storageCount; },
  load: function(file, completeCallback) {
    lineReader(file, (line) => {
      }, lines => {
        const regex = /\d/g;
        let match;
        while (match = regex.exec(lines[0])) {
          fishStorage.push(parseInt(match[0]));
        }
        completeCallback();
      });
  },
  tick: function() {
    let fishesReadyToBreed = fishStorage.pop();
    if (fishesReadyToBreed != null) {
      fishStorage.push(8, fishesReadyToBreed);
      fishStorage.push(6, fishesReadyToBreed);
    }
    
    fishStorage.commit();
  }
}

module.exports = seabed;
