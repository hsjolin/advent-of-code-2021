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
  trajectories: [],
  validVelocities: [],
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
      
      this.reset();
    },
      () => {
        this.run();
        completeCallback(this);
      });
  },
  reset: function () {
    this.vx = 0;
    this.vy = 0;
    this.x = 0;
    this.y = 0;
  },
  run: function () {
    const velocitiesToTest = this.getVelocitiesToTest();
    for (const velocity of velocitiesToTest) {
      this.vx = velocity.vx;
      this.vy = velocity.vy;
      const trajectory = [];
      
      while (true) {
        trajectory.push({ x: this.x, y: this.y });
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

      if (this.isInsideTargetArea()) {
        this.updateMapBoundaries(trajectory);
        this.trajectories.push(trajectory);
        this.validVelocities.push(velocity);
      }

      this.reset();
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

    for (const trajectory of this.trajectories) {
      for (let i = 0; i < trajectory.length; i++) {
        const point = trajectory[i];
        this.map[point.y][point.x] = i == 0 ? 'S' : '#';
      }
    }
  },
  getVelocitiesToTest: function () {
    const vxMax = Math.abs(this.targetArea.x2);
    let _vx = 0;
    let xtarget = 0;
    while (xtarget < this.targetArea.x1 && xtarget < this.targetArea.x2) {
      xtarget = interval(0, ++_vx).reduce((a, b) => a + b);
    }
    const vxMin = _vx - 1;
    const vyMax = Math.abs(this.targetArea.y2) - 1;
    const vyMin = this.targetArea.y2
    const velocities = [];
    for (let vy = vyMin; vy <= vyMax; vy++) {
      for (let vx = vxMin; vx <= vxMax; vx++) {
        velocities.push({ vx, vy });
      }
    }

    return velocities;
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
  updateMapBoundaries: function (trajectory) {
    const xMax = Math.max(...trajectory.map(t => t.x));
    const yMax = Math.max(...trajectory.map(t => t.y));
    const yMin = Math.min(...trajectory.map(t => t.y));

    this.xMax = xMax > this.xMax
      ? xMax
      : this.xMax;

    this.yMax = yMax > this.yMax
      ? yMax
      : this.yMax;
    this.yMin = yMin < this.yMin
      ? yMin
      : this.yMin;
  }
}

module.exports = probe;
