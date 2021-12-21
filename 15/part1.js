const map = require('./map.js');
const djikstras = require('../utils/djikstras');

function main() {
  map.load('./15/input.txt', (data) => {
    console.log(djikstras.findShortestPath({
      startNode: data.find(node => node.startNode),
      destinationNode: data.find(node => node.destinationNode)
    }));
  });
}

main();
