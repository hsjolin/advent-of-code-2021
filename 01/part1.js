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

  lineReader
    .on('line', line => {
      let delta = 'N/A';
      if (lastValue < line)
      {
        delta = '⬆️';
        increases++;
      } else if (lastValue > line)
      {
        delta = '⬇️';
        decreases++;
      }
      console.log(++lineNumber + ': ' + line + ' ' + delta);
      lastValue = line;
    })
    .on('close', () => {
      console.log('Finished');
      console.log('Increases: ' + increases + ', Decreases: ' + decreases);
    })
}
