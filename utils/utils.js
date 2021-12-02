// import fetch from 'node-fetch';
const fs = require('fs');
const readLine = require('readline');

module.exports = class Utils {
  static lineReader(file, lineCallback, completeCallback) {
    const fileStream = fs.createReadStream(file);
    const lineReader = readLine.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    let lines = [];
    lineReader
      .on('line', line => {
        lineCallback(line);
        lines.push(line);
      })
      .on('close', () => {
        completeCallback(lines);
      });
  }
}
