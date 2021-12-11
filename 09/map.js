const utils = require("../utils/utils.js");
const parseFile = utils.parseFile;

var map = {
  data: [],
  mapData: [],
  load: function(file, completeCallback) {
    parseFile(
      file,
      /[0-9]+/,
      match => {
        if (match.length != 1) {
          throw 'Invalid line detected. Expected 1 match but found ' + match.length;
        }

        return [...match[0]];
      },
      results => {
        this.data = results;
        completeCallback();
      }
    )
  },
  verifyData: function() {

  },

  part1: function() {
    const deeps = [];
    for (let y = 0; y < this.data.length; y++) {
      const xArr = this.data[y];
      for (let x = 0; x < xArr.length; x++) {
        const adjacent = this.adjacent(x, y);
        const isDeep = adjacent
          .filter(p => p.depth > -1)
          .every(p => p.depth > parseInt(this.data[y][x]));

        if (isDeep) {
          deeps.push({
            x: parseInt(x),
            y: parseInt(y),
            depth: parseInt(this.data[y][x]),
            points: parseInt(this.data[y][x]) + 1
          });
        }
      }
    }

    return deeps
      .map(d => d.points)
      .reduce((a, b) => a + b);
  },
  part2: function() {
    for (let y = 0; y < this.data.length; y++) {
      const xArr = this.data[y];
      for (let x = 0; x < xArr.length; x++) {
        this.mapData.push({
          x: parseInt(x),
          y: parseInt(y),
          depth: parseInt(this.data[y][x]),
          points: parseInt(this.data[y][x]) + 1,
          trench: false
        });
      }
    }

    this.mapData.forEach(item => {
      const adjacent = this.adjacent(item.x, item.y);
      const isDeep = adjacent
        .filter(p => p.depth > -1)
        .every(p => p.depth > item.depth);

      if (isDeep) {
        item.trench = true;
        this.adjacentRecursive(item)
            .forEach(element => {
              this.mapData.find(p => p.x == element.x && p.y == element.y).trench = true;
            });
      }
    });

    return this.mapData;
  },
  adjacentRecursive: function(currentPoint) {
    const adjacent = this.adjacent(currentPoint.x, currentPoint.y)
      .filter(point => point.depth == currentPoint.depth + 1);
    
    
    return [currentPoint].concat(adjacent.flatMap(p => this.adjacentRecursive(p)))
  },
  draw: function() {
    console.log(this.mapData.map(item => {
      const lineEnding = item.x == Math.max(...this.mapData.map(p => p.x))
        ? '\r\n\r\n'
        : '';

      if (item.trench) {
        return '(' + item.depth + ')' + lineEnding;
      }

      return ' ' + item.depth + ' ' + lineEnding;
    }).join(''));
  },
  adjacent: function(x, y) {
    const extractPoint = (x, y) => {
      if (this.data[y]) {
        if (this.data[y][x]) {
          return parseInt(this.data[y][x]);
        }
      }

      return -1;
    }

    return [
      {
        x: x + 1,
        y: y,
        depth: extractPoint(x + 1, y)
      },
      {
        x: x,
        y: y + 1,
        depth: extractPoint(x, y + 1)
      },
      {
        x: x,
        y: y - 1,
        depth: extractPoint(x, y - 1)
      },
      {
        x: x - 1,
        y: y,
        depth: extractPoint(x - 1, y)
      },
    ];
  }
}

module.exports = map;
