const utils = require('../utils/utils');
const parseFile = utils.parseFile;
const interval = utils.interval;

var snailFish = {
  numbers: [],
  string: '',
  load: function (file, completeCallback) {
    parseFile(file, /.*/, match => {
      if (match.length != 1) {
        throw 'Invalid match ' + match
      }
      this.string = match[0];
      this.parse(0);
    },
      () => {
        this.run();
        completeCallback(this);
      });
  },
  run: function () {
  },
  parse: function (index) {
    if (this.string.length <= index) {
      return -1;
    }

    const char = this.string[index];
    if (char == '[') {
      return this.parse(index + 1);
    }

    const closingBracketIndex = this.parse(index + 1);
    
    return this.parse(string.substring(1));
  }
}

module.exports = snailFish;
