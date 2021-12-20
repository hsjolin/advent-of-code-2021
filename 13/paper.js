const utils = require('../utils/utils.js');
const parseFile = utils.parseFile;

var paper = {
  points: [],
  folds: [],
  foldCount: 0,
  height: 0,
  width: 0,
  load: function (file, completeCallback) {
    parseFile(file, /(?:(\d+),(\d+))|(?:fold along (\S)=(\d+))/, match => {
      if (match.length != 5) {
        throw 'Invalid match ' + match
      }
      const x = parseInt(match[1]);
      const y = parseInt(match[2]);
      const foldAxis = match[3];
      const foldPosition = parseInt(match[4]);

      if (x >= 0 && y >= 0) {
        this.points.push(this.createPoint(x, y));
        this.height = this.height < y
          ? y
          : this.height
        this.width = this.width < x
          ? x
          : this.width
      }

      if (foldAxis && foldPosition >= 0) {
        this.folds.push({ axis: foldAxis, position: foldPosition });
      }
    },
      () => {
        completeCallback();
      });
  },
  fold: function () {
    if (this.foldCount == this.folds.length) {
      return null;
    }

    const fold = this.folds[this.foldCount];
    let foldedArr = [];

    if (fold.axis == 'y') {
      const points = this.points
        .filter(p => p.y > fold.position);

      foldedArr = this.points
        .filter(p => p.y < fold.position)
        .map(p => p.copy());

      points.forEach(p => {
        const newY = 2 * fold.position - p.y;
        const existingPoint = foldedArr
          .find(px => px.x == p.x && px.y == newY);

        if (existingPoint) {
          existingPoint.count++;
        } else {
          foldedArr.push(this.createPoint(p.x, newY));
        }
      });
    } else if (fold.axis == 'x') {
      const points = this.points
        .filter(p => p.x > fold.position);

      foldedArr = this.points
        .filter(p => p.x < fold.position)
        .map(p => p.copy());

      points.forEach(p => {
        const newX = 2 * fold.position - p.x;
        const existingPoint = foldedArr
          .find(px => px.x == newX && px.y == p.y);

        if (existingPoint) {
          existingPoint.count++;
        } else {
          foldedArr.push(this.createPoint(newX, p.y));
        }
      });    
    }

    return {
      points: foldedArr,
      folds: this.folds,
      fold: this.fold,
      foldCount: this.foldCount + 1,
      createPoint: this.createPoint,
      height: fold.axis == 'y'
        ? fold.position - 1
        : this.height,
      width: fold.axis == 'x'
        ? fold.position - 1
        : this.width
    }
},
  createPoint (x, y) {
    return {
      x,
      y,
      count: 0,
      copy: function () {
        return {
          x: this.x, 
          y: this.y, 
          count: this.count,
          copy: this.copy
        }
      }
    }
  },
 
}

module.exports = paper;
