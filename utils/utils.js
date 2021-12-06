// import fetch from 'node-fetch';
const fs = require('fs');
const readLine = require('readline');
const subMarine = {
  xPos: 0,
  depth: 0,
  aim: 0,
  executeCommand: function (command) {
    switch (command.type) {
      case 'forward':
        this.xPos += command.input;
        this.depth += this.aim * command.input;
        break;
      case 'up':
        this.aim -= command.input;
        break;
      case 'down':
        this.aim += command.input;
        break;
      default: throw { message: 'WTF!? ' + command.type }
    }
  }
}


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

  static readFile(file, completeCallback) {
    fs.readFile(file, 'utf8' , (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      completeCallback(data);
    });
  }

  static readFileSync(file) {
    return fs.readFileSync(file, 'utf8');
  }

  static fileWriter(file, data) {
    fs.writeFileSync(file, data);
  }

  static appendFile(file, data) {
    fs.appendFileSync(file, data, 'utf8');
  }

  static replaceFile(target, source) {
    fs.unlinkSync(target);
    fs.renameSync(source, target);
  }

  static parseCommand(str) {
    const cmdRegex = /^([a-z]+)\s([\d]+)$/
    const matches = str.match(cmdRegex);

    return {
      type: matches[1],
      input: parseInt(matches[2])
    };
  }

  static getSubmarine() {
    return subMarine;
  }
}
