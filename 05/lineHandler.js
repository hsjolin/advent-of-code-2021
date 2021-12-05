const utils = require("../utils/utils.js");
const lineReader = utils.lineReader;
const fileWriter = utils.fileWriter;

var lineHandler = {
  includeDiagonalLines: false,
  lines: [],
  load: function(file, completeCallback) {
    lineReader(file, (line) => {
        const regex = /([\d]+)\,([\d]+)\s\-\>\s([\d]+)\,([\d]+)/;
        const match = line.match(regex);
        if (match.length != 5) {
          throw 'Regex did not match: ' + line;
        }
        let lineObj = {
          includeDiagonalLines: this.includeDiagonalLines,
          x1: parseInt(match[1]),
          y1: parseInt(match[2]),
          x2: parseInt(match[3]),
          y2: parseInt(match[4]),
          points: function() {
            let points = [];
            let x = this.x1;
            let y = this.y1;
            while (true) {
              points.push([x, y]);
              if (x == this.x2 && y == this.y2) {
                break;
              }
              if (x < this.x2) {
                x++;
              } else if (x > this.x2) {
                x--;
              }
              if (y < this.y2) {
                y++;
              } else if(y > this.y2) {
                y--;
              }
            }

            return points;
          },
          isValid: function() {
            let dy = Math.abs(this.y1 - this.y2);
            let dx = Math.abs(this.x1 - this.x2);

            if (this.includeDiagonalLines) {
              return dy == 0 || dx == 0 || dy == dx;
            }

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
    // console.log(xMax, yMax);
    const canvas = [];
    for(let y = 0; y <= yMax + 1; y++) {
      canvas.push([]);
      for(let x = 0; x <= xMax + 1; x++) {
        canvas[y].push(0);
      }
    }

    let intersections = 0;

    validLines.forEach(line => {
      let points = line.points();
      points.forEach(point => {
        try {
          let current = canvas[point[0]][point[1]];
          if (current == 1) {
            intersections++;
          }

          canvas[point[0]][point[1]] = current + 1;
        } catch (e) {
          console.log('Error', point[0], point[1]);
          return;
        }
      });
    });
    console.log('Points: ' + intersections);
    fileWriter('out.txt', canvas
      .map(row => row.join(''))
      .join('\r\n'));
  }
}

module.exports = lineHandler;
