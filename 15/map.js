const utils = require('../utils/utils');
const parseFile = utils.parseFile;

var map = {
  nodes: [],
  map: [],
  load: function (file, completeCallback) {
    parseFile(file, /[\d]+/, match => {
      if (match.length != 1) {
        throw 'Invalid match ' + match
      }

      this.map.push([...match[0]].map(c => parseInt(c)));
    },
      () => {
        const createNode = (x, y, distance) => {
          const existingNode = this.nodes.find(node => node.x == x && node.y == y);
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

          this.nodes.push(node);
          return node;
        };

        const positionIsValid = (x, y) => {
          if (this.map[y]) {
            if (this.map[y][x] >= 0) {
              return true;
            }
          }

          return false;
        };
        const getAdjacents = (x, y) => {
          const adjecents = [];
          if (positionIsValid(x + 1, y)) adjecents.push(createNode(x + 1, y, this.map[y][x + 1]));
          if (positionIsValid(x - 1, y)) adjecents.push(createNode(x - 1, y, this.map[y][x - 1]));
          if (positionIsValid(x, y + 1)) adjecents.push(createNode(x, y + 1, this.map[y + 1][x]));
          if (positionIsValid(x, y - 1)) adjecents.push(createNode(x, y - 1, this.map[y - 1][x]));
          return adjecents;
        };

        for (let y = 0; y < this.map.length; y++) {
          const yarr = this.map[y];
          for (let x = 0; x < yarr.length; x++) {
            const node = createNode(x, y, this.map[y][x]);
            node.adjacentNodes = getAdjacents(x, y);
          }
        }

        const xmax = Math.max(...this.nodes.map(node => node.x));
        const ymax = Math.max(...this.nodes.map(node => node.y));

        this.nodes.find(node => node.x == xmax && node.y == ymax).destinationNode = true;
        this.nodes.find(node => node.x == 0 && node.y == 0).startNode = true;

        completeCallback(this.nodes);
      });
  }
}

module.exports = map;
