const utils = require('../utils/utils');
const parseFile = utils.parseFile;

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

      const sum = this.createNumber(
        this.sum,
        number,
        null
      );

      if (!isNumeric(sum.left)) {
        sum.left.parent = sum;
      }

      if (!isNumeric(sum.right)) {
        sum.right.parent = sum;
      }
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
  createNumber: function (left, right, parent) {
    return {
      left: left,
      right: right,
      parent: parent,
      // toList: this.numberToList,
      isParentOf: this.isParentOf,
      closestToLeft: this.closestToLeft,
      closestToRight: this.closestToRight,
      closestChildLeft: this.closestChildLeft,
      closestChildRight: this.closestChildRight
    };
  },
  isParentOf: function (number) {
    if (!number.parent) {
      return false;
    }
    if (number.parent == this) {
      return true;
    }

    return this.isParentOf(number.parent);
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
  closestToLeft: function (child) {
    if (isNumeric(this.left)) {
      return this;
    }

    if (this.left != child) {
      return this.left.closestChildRight(); 
    }

    if (this.parent) {
      return this.parent.closestToLeft(this);
    }

    return null;
  },
  closestToRight: function (child) {
    if (isNumeric(this.right)) {
      return this;
    }

    if (this.right != child) {
      return this.right.closestChildLeft(); 
    }

    if (this.parent) {
      return this.parent.closestToRight(this);
    }

    return null;
  },
  closestChildRight: function () {
    if (isNumeric(this.right)) {
      return this;
    }

    return this.right.closestChildRight();
  },
  closestChildLeft: function () {
    if (isNumeric(this.left)) {
      return this;
    }

    return this.left.closestChildLeft();
  },
  explode: function (number) {
    const closestToLeft = number.parent.closestToLeft(number);
    if (closestToLeft) {
      if (closestToLeft.isParentOf(number)) {
        closestToLeft.left += number.left;
      } else {
        closestToLeft.right += number.left;
      }
    }

    const closestToRight = number.parent.closestToRight(number);
    if (closestToRight) {
      if (closestToRight.isParentOf(number)) {
        closestToRight.right += number.right;
      } else {
        closestToRight.left += number.right;
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
      number.left = this.createNumber(
        Math.floor(number.left / 2),
        Math.ceil(number.left / 2),
        number
      ); 
    } else {
      number.right = this.createNumber(
        Math.floor(number.right / 2),
        Math.ceil(number.right / 2),
        number
      );
    }
  },
  splitRecursive(number) {
    if (isNumeric(number)) {
      return false;
    }

    if (isNumeric(number.left) && number.left >= 10) {
      this.split(number, true);
      return true;
    }

    if (isNumeric(number.right) && number.right >= 10) {
      this.split(number, false);
      return true;
    }

    return this.splitRecursive(number.left)
      || this.splitRecursive(number.right);
    ;
  },
  explodeRecursive(number, nesting) {
    if (isNumeric(number)) {
      return false;
    }

    if (nesting >= 4 && isNumeric(number.left) && isNumeric(number.right)) {
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

    const pair = this.createNumber(null, null, null);
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

    return pair;
  }
}

module.exports = snailFish;
