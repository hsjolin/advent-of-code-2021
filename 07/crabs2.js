const utils = require("../utils/utils.js");
const lineReader = utils.lineReader;

var crabfishSubmarines = {
  positions: [],
  load: function(file, completeCallback) {
    lineReader(file, (line) => {
      }, lines => {
        let fishes = [];
        const regex = /\d+/g;
        let match;
        while (match = regex.exec(lines[0])) {
          this.positions.push({ id: this.positions.length, fuelPoints: 0, position: parseInt(match[0]) });
        }

        console.log('Loaded ' + this.positions.length + ' positions');
        completeCallback();
      });
  },
  calculate: function() {
    const positionsArr = this.positions.map(pos => pos.position);
    const maxPosition = Math.max(...positionsArr);
    const minPosition = Math.min(...positionsArr);

    let best = null;
    for (let position = minPosition; position < maxPosition; position++) {
      let fuel = 0;
      this.positions.forEach(item => {
        let distance = Math.abs(item.position - position);
        for (let i = 1; i <= distance; i++) {
          fuel += i;
        }
      });

      if (best == null || fuel < best.points) {
        best = {
          position: position,
          points: fuel
        }
      }
    }

    return best;
  }
}

module.exports = crabfishSubmarines;
