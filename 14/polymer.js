const utils = require('../utils/utils.js');
const parseFile = utils.parseFile;

var polymer = {
  template: null,
  rules: {},
  charCount: {},
  stepCount: 0,
  load: function (file, completeCallback) {
    parseFile(file, /([A-Z]{3,})|([A-Z]{2}) -> ([A-Z])/, match => {
      if (match.length != 4) {
        throw 'Invalid match ' + match
      }

      const template = match[1];
      const rule = match[2];
      const char = match[3];

      if (template) {
        this.template = template;
      }

      if (rule && char) {
        this.rules[rule] = char;
      }
    },
    () => {
      completeCallback();
    });
  },
  step: function () {
    let totalLength = this.template.length;
    for (let i = 0; i < this.charCount.length; i++) {
      totalLength += this.charCount[i];
    }

    for (let i = 0; i < totalLength - 1; i++) {
      const pair = template[i] + template[i + 1];
      const char = this.rules[pair];

      let charCount = this.charCount[char];
      if (!charCount) {
        this.charCount[char] = 1;
      } else {
        this.charCount[char]++;
      }
    }

    this.stepCount++;
  },
  count: function () {
    return this.charCount;
  }
}

module.exports = polymer;
