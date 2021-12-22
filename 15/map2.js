const utils = require('../utils/utils');
const parseFile = utils.parseFile;

var map = {
  map: [],
  load: function (file, completeCallback) {
    let y = 0;
    parseFile(file, /[\d]+/, match => {
      if (match.length != 1) {
        throw 'Invalid match ' + match
      }
      
      let x = 0;

      for (let q = 0; q < 5; q++) {
        for (let number of [...match[0]].map(c => this.transform(parseInt(c), q))) {
          this.createNode(x++, y, number);
        }
      }

      y++;
    },
      () => {
        console.log('Processing data...');
        const len = this.map.length;

        
        for (let q = 1; q < 5; q++) {
          for (let y = 0; y < len; y++) {
            const transformed = this.transformArr(this.map[y], q);
            transformed.forEach(n => n.y = len * q + y);
            this.map[len * q + y] = transformed;
          }
        }

        const positionIsValid = (x, y) => {
          if (this.map[y]) {
            if (this.map[y][x]) {
              return true;
            }
          }

          return false;
        };
        const getAdjacents = (x, y) => {
          const adjecents = [];
          if (positionIsValid(x + 1, y)) adjecents.push(this.getNode(x + 1, y));
          if (positionIsValid(x - 1, y)) adjecents.push(this.getNode(x - 1, y));
          if (positionIsValid(x, y + 1)) adjecents.push(this.getNode(x, y + 1));
          if (positionIsValid(x, y - 1)) adjecents.push(this.getNode(x, y - 1));
          return adjecents;
        };

        console.log('Creating adjacent nodes...')
        for (let y = 0; y < this.map.length; y++) {
          const yarr = this.map[y];
          for (let x = 0; x < yarr.length; x++) {
            const node = this.getNode(x, y);
            node.adjacentNodes = getAdjacents(x, y);
          }
        }
        console.log('Done creating adjacent nodes.')

        const xmax = this.map[0].length - 1;
        const ymax = this.map.length - 1;

        this.getNode(xmax, ymax).destinationNode = true;
        this.getNode(0, 0).startNode = true;

        console.log('Done processing data.');
        console.log('Map size: ' + this.map.length + 'x' + this.map[0].length);
        completeCallback(this);
      });
  },
  transform: function (c, q) {
    return c + q > 9 ? c + q - 9 : c + q;
  },
  transformArr: function (arr, q) {
    const transformed = [];
    for (let i = 0; i < arr.length; i++) {
      const node = arr.map(n => n)[i];
      node.distance = this.transform(node.distance, q);
      transformed[i] = node;
    }
    return transformed;
  },
  createNode: function (x, y, distance) {
    const existingNode = this.getNode(x, y);
    if (existingNode) {
      return existingNode;
    }

    const node = {
      x,
      y,
      distance,
      totalDistance: 99999999,
      explored: false,
      startNode: false,
      destinationNode: false
    };

    this.setNode(x, y, node);
    return node;
  },
  getNode: function (x, y) {
    if (this.map[y]) {
      if (this.map[y][x]) {
        return this.map[y][x];
      }
    }

    return null;
  },
  setNode: function (x, y, data) {
    if (!this.map[y]) {
      this.map[y] = [];
    }
    this.map[y][x] = data;
  }
}

module.exports = map;
