const utils = require('../utils/utils');
const parseFile = utils.parseFile;
const interval = utils.interval;

const isNumeric = function (number) {
  return !isNaN(number);
}

var snailFish = {
  numbers: [],
  sum: null,
  string: '',
  load: function (file, completeCallback) {
    parseFile(file, /.*/, match => {
      if (match.length != 1) {
        throw 'Invalid match ' + match
      }
      this.string = match[0];
      this.read(1);
      this.numbers.push(this.parse());
    },
      () => {
        completeCallback(this);
      });
  },
  run: function (step) {
    this.sum = this.numbers[0];
    for (let number of this.numbers) {
      if (number == this.sum) {
        continue;
      }

      const sum = {
        left: this.sum,
        right: number
      };

      if (!isNumeric(sum.left)) {
        sum.left.parent = sum;
      }

      if (!isNumeric(sum.right)) {
        sum.right.parent = sum;
      }
      sum.toList = this.numberToList;
      this.sum = sum;

      let counter = 0;
      this.lastAction = 'addition';
      step(++counter);
      while (true) {
        const exploded = this.explodeRecursive(this.sum, 0);
        const splitted = exploded || this.splitRecursive(this.sum);

        if (exploded) {
          this.lastAction = 'explode';
        } else if (splitted) {
          this.lastAction = 'split';
        } else {
          this.lastAction = 'noop';
          break;
        }
        step(++counter);
      }
    }
  },
  read: function (num) {
    const str = this.string.substring(0, num);
    this.string = this.string.substring(num);
    return str;
  },
  numberToList: function () {
    const list = [];
    const number = this;
    
    if (!isNumeric(number.left)) {
      list.push(...number.left.toList());
    }

    list.push(number);
    
    if (!isNumeric(number.right)) {
      list.push(...number.right.toList());
    }

    return list;
  },
  explode: function (number) {
    const list = this.sum.toList();
    const index = list.indexOf(number);

    for (let i = index - 1; i >= 0; i--) {
      const node = list[i];
      if (isNumeric(node.right)) {
        node.right += number.left;
        break;
      }
      if (isNumeric(node.left)) {
        node.left += number.left;
        break;
      }
    }

    for (let i = index + 1; i < list.length; i++) {
      const node = list[i];
      if (isNumeric(node.left)) {
        node.left += number.right;
        break;
      }
      if (isNumeric(node.right)) {
        node.right += number.right;
        break;
      }
    }

    if (number.parent.left == number) {
      number.parent.left = 0;
    } else {
      number.parent.right = 0;
    }
  },
  split: function (number, left) {
    if (left) {
      number.left = {
        left: Math.floor(number.left / 2),
        right: Math.ceil(number.left / 2),
        parent: number,
        toList: this.numberToList
      };
    } else {
      number.right = {
        left: Math.floor(number.right / 2),
        right: Math.ceil(number.right / 2),
        parent: number,
        toList: this.numberToList
      };
    }
  },
  splitRecursive(number) {
    if (!isNaN(number)) {
      return false;
    }

    if (number.left >= 10) {
      this.split(number, true);
      return true;
    }

    if (number.right >= 10) {
      this.split(number, false);
      return true;
    }

    return this.splitRecursive(number.left)
      || this.splitRecursive(number.right);
    ;
  },
  explodeRecursive(number, nesting) {
    if (!isNaN(number)) {
      return false;
    }

    if (nesting == 4) {
      this.explode(number);
      return true;
    }

    return this.explodeRecursive(number.left, nesting + 1)
      || this.explodeRecursive(number.right, nesting + 1);
  },
  parse: function () {
    if (this.string.length == 0) {
      throw 'Reached EOL';
    }

    const parseNumber = () => {
      let numberString = '';
      while (!isNaN(char)) {
        numberString += char;
        char = this.read(1);
      }

      return parseInt(numberString);
    };

    const pair = {};
    let char = this.read(1);

    if (char == '[') {
      pair.left = this.parse();
      pair.left.parent = pair;
    } else {
      pair.left = parseNumber();
    }

    char = this.read(1);

    if (char == '[') {
      pair.right = this.parse();
      pair.right.parent = pair;
    } else {
      pair.right = parseNumber();
    }

    this.read(1);
    pair.toList = this.numberToList;

    return pair;
  }
}

module.exports = snailFish;
