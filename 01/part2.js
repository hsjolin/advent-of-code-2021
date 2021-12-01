// import fetch from 'node-fetch';
const fs = require('fs');
const readLine = require('readline');

main();

function main() {
  const fileStream = fs.createReadStream('input.txt');
  const lineReader = readLine.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lineNumber = 0;
  let lastValue = null;
  let decreases = 0;
  let increases = 0;
  let lines = [];
  let lastSum = null;
  lineReader
    .on('line', line => {
      lines.push(line);
    })
    .on('close', () => {
      for (let index = 0;; index++) {
        if (!lines[index + 2]) {
          break;
        }
        const sum = parseInt(lines[index]) + parseInt(lines[index + 1]) + parseInt(lines[index + 2]);
        let delta = '➡️';
        if (!lastSum) {
          delta = '🚫';
        } else if (lastSum < sum) {
          increases++;
          delta = '⬆️';
        } else if (lastSum > sum) {
          decreases++;
          delta = '⬇️';
        }
        console.log(lastSum + ' ' + sum + ' ' + delta);
        lastSum = sum;
      }
      console.log('Increases: ' + increases + ', decreases: ' + decreases);
    });
}
