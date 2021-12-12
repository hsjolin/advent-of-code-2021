const utils = require("../utils/utils.js");

const parseFile = utils.parseFile;
const writeFile = utils.fileWriter;

var map = {
  mapData: [],
  load: function(file, completeCallback) {
    let x = 0;
    let y = 0;

    parseFile(
      file,
      /[0-9]+/,
      match => {
        if (match.length != 1) {
          throw 'Invalid line detected. Expected 1 match but found ' + match.length;
        }

        const arr = [...match[0]].map(depth => {
            return {
              x: x++,
              y: y,
              depth: parseInt(depth),
              points: parseInt(depth) + 1,
              basin: false,
              basinSize: 0
            }
        });

        y++;
        x = 0;
        return arr;
      },
      results => {
        this.mapData = results.flatMap(r => r);
        completeCallback();
      }
    )
  },
  part1: function() {
    const deeps = [];
    for (item of this.mapData) {
      const adjacent = this.adjacent(item);
      const isDeep = adjacent
        .filter(p => p.depth > -1)
        .every(p => p.depth > item.depth);

      if (isDeep) {
        deeps.push(item);
      }
    }

    return deeps
      .map(d => d.points)
      .reduce((a, b) => a + b);
  },
  part2: function() {
    this.mapData.forEach(item => {
      let adjacent = this.adjacent(item);
      let isDeep = adjacent
        .every(p => p.depth > item.depth);

      if (isDeep) {
        const basin = this.adjacentRecursive(item);
        item.basin = true;
        item.basinSize = basin.length + 1;

        if (item.basinSize > 92) {
          console.log(item);
        }

        basin.forEach(element => {
          element.basin = true;
        });
      }
    });

    const threeLargest = this.mapData
      .map(p => p)
      .sort((a, b) => b.basinSize - a.basinSize)
      .slice(0, 3);
    
    // console.log(threeLargest);
  },
  adjacentRecursive: function(currentPoint) {
    let result = [];
    let adjacent = this.adjacent(currentPoint)
      .filter(point => point.depth < 9 
        && point.depth > currentPoint.depth
        && !point.visited);

    result.push(...adjacent);
    currentPoint.visited = true;

    for (let point of adjacent) {
      point.visited = true;
      result.push(...this.adjacentRecursive(point));
    }

    return result;
  },
  draw: function() {
    writeFile('out.txt', this.mapData.map(item => {
      const lineEnding = item.x == Math.max(...this.mapData.map(p => p.x))
        ? '\r\n'
        : '';

      if (item.basinSize > 0) {
        return ('000' + item.basinSize).slice(-3) + lineEnding;
      } 
      
      if (item.basin) {
        return '(' + item.depth + ')' + lineEnding;
      }

      return ' ' + item.depth + ' ' + lineEnding;
    }).join(''));
  },
  adjacent: function(point) {
    let result = [];
    result.push(this.mapData.find(m => m.x == point.x + 1 && m.y == point.y)),
    result.push(this.mapData.find(m => m.x == point.x - 1 && m.y == point.y)),
    result.push(this.mapData.find(m => m.x == point.x && m.y + 1 == point.y)),
    result.push(this.mapData.find(m => m.x == point.x && m.y - 1 == point.y))
    result = result.filter(r => r);
    return result;
  }
}

module.exports = map;
