const utils = require("../utils/utils.js");
const lineReader = utils.lineReader;

var octopusEngine = {
  octopuses: [],
  stepListener: null,
  flashCount: 0,
  iteration: 0,
  interval: null,
  load: function (file, completeCallback) {
    let x = 0;
    let y = 0;
    lineReader(
      file,
      line => {
        this.octopuses.push([...line]
          .map(char => {
            return {
              value: parseInt(char),
              x: x++,
              y: y
            }
          }));
        x = 0;
        y++;
      },
      results => {
        completeCallback(this.octopuses);
      }
    )
  },
  start: function (iterations) {
    if (!this.stepListener) {
      throw "No listener set";
    }

    this.maxIterations = iterations;

    this.interval = setInterval(() => {
      this.step();
      this.stepListener(this.octopuses);
    }, 100);
  },
  stop: function () {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
  prepare: function () {
    for (let y = 0; y < this.octopuses.length; y++) {
      for (let x = 0; x < this.octopuses[y].length; x++) {
        this.octopuses[y][x].value++;
      }
    }
  },
  step: function () {
    this.prepare();
    this.flash();
    this.iteration++;
    this.stepListener(this.octopuses);

    if (this.iteration == this.maxIterations || this.octopuses
      .flatMap(o => o)
      .every(o => o.value == 0)) {
        
      this.stop();
    }
  },
  flash: function () {
    let flashingOctopuses = this.octopuses
      .flatMap(o => o)
      .filter(o => o.value > 9);

    while (flashingOctopuses.length > 0) {
      flashingOctopuses.forEach(octopus => {
        this.flashCount++;
        octopus.value = 0;
        this.adjecentTo(octopus)
          .filter(adjecent => adjecent.value > 0)
          .forEach(adjecent => { adjecent.value++; });
      });

      flashingOctopuses = this.octopuses
        .flatMap(o => o)
        .filter(o => o.value > 9);
    }
  },
  adjecentTo: function (octopus) {
    const adjecents = [];
    for (let y = octopus.y - 1; y <= octopus.y + 1; y++) {
      if (!this.octopuses[y]) {
        continue;
      }

      for (let x = octopus.x - 1; x <= octopus.x + 1; x++) {
        if (y == octopus.y && x == octopus.x) {
          continue;
        }

        if (!this.octopuses[y][x]) {
          continue;
        }
  
        adjecents.push(this.octopuses[y][x]);
      }
    }
    
    return adjecents;
  },
  tick(tickHandler) {
    this.stepListener = tickHandler;
  }
}

module.exports = octopusEngine;
