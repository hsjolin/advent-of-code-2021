const utils = require('../utils/utils.js');
const parseFile = utils.parseFile;

var polymer = {
  rules: {},
  charCount: null,
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
        const pairs = [];
        const chars = {};
        for (let i = 0; i < template.length - 1; i++) {
          const pair = template[i] + template[i + 1];

          let currentPair = pairs
            .find(p => p.name == pair);

          if (!currentPair) {
            currentPair = {
              name: pair,
              count: 1
            }

            pairs.push(currentPair);
          } else {
            currentPair.count++;
          }
        }

        for (const char of template) {
          if (!chars[char]) {
            chars[char] = 1;
          } else {
            chars[char]++;
          }
        }

        this.charCount = {
          pairs,
          chars,
          total: template.length
        };
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
    const current = {
      pairs: [],
      chars: this.charCount.chars,
      total: 0
    };

    const last = this.charCount;
    const pairCount = last.pairs.length;

    for (let i = 0; i < pairCount; i++) {
      const pair = last.pairs[i];
      const char = this.rules[pair.name];

      if (!current.chars[char]) {
        current.chars[char] = 0;
      }

      current.chars[char] += pair.count;

      this.createPair(current, char + pair.name[1], pair.count);
      this.createPair(current, pair.name[0] + char, pair.count);
    }

    this.stepCount++;
    current.total = current.pairs
      .map(p => p.count)
      .reduce((a, b) => a + b) + 1;
    
    this.charCount = current;

    return current;
  },
  count: function () {
    return this.charCount;
  },
  createPair: function (current, newPairName, count) {
    let newPair = current.pairs
      .map(p => p)
      .find(p => p.name == newPairName);

    if (!newPair) {
      newPair = {
        name: newPairName,
        count: count
      };

      current.pairs.push(newPair);
    } else {
      newPair.count += count;
    }
  }
}

module.exports = polymer;
