const utils = require("../utils/utils.js");
const lineReader = utils.lineReader;
const fileWriter = utils.fileWriter;

var lineHandler = {
  lines: [],
  load: function(file, completeCallback) {
    lineReader(file, (line) => {
        const regex = /([\d]+)\,([\d]+)\s\-\>\s([\d]+)\,([\d]+)/;
        const match = line.match(regex);
        if (match.length != 5) {
          throw 'Regex did not match: ' + line;
        }
        let lineObj = {
          x1: parseInt(match[1]),
          y1: parseInt(match[2]),
          x2: parseInt(match[3]),
          y2: parseInt(match[4]),
          points: function() {
            let xmin = Math.min(this.x1, this.x2);
            let ymin = Math.min(this.y1, this.y2);
            let dy = Math.abs(this.y1 - this.y2);
            let dx = Math.abs(this.x1 - this.x2);

            let points = [];
            for (let x = xmin; x <= xmin + dx; x++) {
              for (let y = ymin; y <= ymin + dy; y++) {
                points.push([x, y]);
              }
            }

            return points;
          },
          isValid: function() {
            let dy = Math.abs(this.y1 - this.y2);
            let dx = Math.abs(this.x1 - this.x2);

            return dy == 0 || dx == 0;
          }
        }

        this.lines.push(lineObj);
      }, lines => {
        console.log('Loaded ' + this.lines.length + ' lines');
        completeCallback();
      });
  },
  draw: function() {
    console.log('Writing to out.txt');

    let validLines = this.lines.filter(line => line.isValid());

    const xMax = Math.max(Math.max(...validLines
        .map(line => line.x1)), Math.max(...validLines
            .map(line => line.x2)));
    const yMax = Math.max(Math.max(...validLines
        .map(line => line.y1)), Math.max(...validLines
            .map(line => line.y2)));

    const canvas = [];
    for(let y = 0; y <= yMax; y++) {
      canvas.push([]);
      for(let x = 0; x <= xMax; x++) {
        canvas[y].push('.');
      }
    }

    validLines.forEach(line => {
      let points = line.points();
      points.forEach(point => {
        canvas[point[0]][point[1]] = '*';
      });
    });

    fileWriter('out.txt', canvas
      .map(row => row.join(''))
      .join('\r\n'));
  }
}

module.exports = lineHandler;
