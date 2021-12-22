const map = require('./map2.js');
const djikstras = require('../utils/djikstras');

function main() {
  map.load('./15/test.txt', (data) => {
    for (let y = 0; y < data.map.length; y++) {
      const yarr = data.map[y];
      console.log([...yarr.map(n => n.distance)].join(''));
    }
    console.log(djikstras.findShortestPath({
      startNode: data.getNode(0, 0),
      destinationNode: data.getNode(data.map.length - 1, data.map[0].length - 1)
    }));
  });
}

main();
