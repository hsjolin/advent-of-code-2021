const utils = require('../utils/utils');
const parseFile = utils.parseFile;
const interval = utils.interval;

var probe = {
  map: [],
  targetArea: {},
  x: 0,
  y: 0,
  yMin: -999999,
  xMin: -999999,
  yMax: -999999,
  xMax: -999999,
  trajectory: [],
  load: function (file, completeCallback) {
    parseFile(file, /x=(-?\d+)\.\.(-?\d+), y=(-?\d+)\.\.(-?\d+)/, match => {
      if (match.length != 5) {
        throw 'Invalid match ' + match
      }

      this.targetArea = {
        x1: parseInt(match[1]),
        x2: parseInt(match[2]),
        y1: parseInt(match[4]),
        y2: parseInt(match[3])
      };

      this.xMin = 0;
      this.yMin = this.targetArea.y2;
      this.xMax = this.targetArea.x2;
      this.yMax = this.targetArea.y1;
      
      let vx = 0;
      let xtarget = 0;
      while (xtarget < this.targetArea.x1 && xtarget < this.targetArea.x2) {
        xtarget = interval(0, ++vx).reduce((a, b) => a + b);
      }

      this.vx = vx;
      this.vy = Math.abs(this.targetArea.y2) - 1;
    },
      () => {
        this.run();
        completeCallback(this);
      });
  },
  run: function () {
    while (true) {
      this.trajectory.push({x: this.x, y: this.y});
      this.updateMapBoundaries();
      if (this.isInsideTargetArea() || this.isOutOfBounds()) {
        break;
      }
      this.x += this.vx;
      this.y += this.vy;
      if (this.vx < 0) {
        this.vx++;
      } else if (this.vx > 0) {
        this.vx--;
      }

      this.vy--;
    }

    this.map = [];
    for (let y = this.yMin; y < this.yMax + 1; y++) {
      this.map[y] = [];
      for (let x = this.xMin; x < this.xMax + 1; x++) {
        this.map[y][x] = '.';
      }
    }

    for (let y = this.targetArea.y1; y >= this.targetArea.y2; y--) {
      for (let x = this.targetArea.x1; x <= this.targetArea.x2; x++) {
        this.map[y][x] = 'T';
      }
    }

    for (let i = 0; i < this.trajectory.length; i++) {
      const point = this.trajectory[i];
      this.map[point.y][point.x] = i == 0 ? 'S' : '#';
    }
  },
  isInsideTargetArea: function () {
    return this.x >= this.targetArea.x1
      && this.x <= this.targetArea.x2
      && this.y <= this.targetArea.y1
      && this.y >= this.targetArea.y2;
  },
  isOutOfBounds: function () {
    return this.x > this.targetArea.x2
      || this.y < this.targetArea.y2;
  },
  updateMapBoundaries: function () {
    this.xMax = this.x > this.xMax
      ? this.x
      : this.xMax;

    this.yMax = this.y > this.yMax
      ? this.y
      : this.yMax;
    this.yMin = this.y < this.yMin
      ? this.y
      : this.yMin;
  }
}

module.exports = probe;
