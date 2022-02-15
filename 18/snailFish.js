const utils = require('../utils/utils');
const parseFile = utils.parseFile;
const interval = utils.interval;

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
  run: function () {
    this.sum = this.numbers[0];
    for (let number of this.numbers) {
      if (number == this.sum) {
        continue;
      }

      this.sum = {
        n1: this.sum,
        n2: number
      };

      let counter = 0;
      while (this.explodeRecursive(this.sum, 0)
        || this.splitRecursive(this.sum)) {
        // console.log(counter++);
      }
    }
  },
  read: function (num) {
    const str = this.string.substring(0, num);
    this.string = this.string.substring(num);
    return str;
  },
  findChild: function (number, childSelector, findCondition) {
    const child = childSelector(number);

    if (!child) {
      return null;
    }

    if (findCondition(child)) {
      return child;
    }

    return this.findChild(child, childSelector, findCondition);
  },
  findClosest: function (number, left) {
    if (!number) {
      return null;
    }
    
    let parent = number.parent;

    while (parent) {
      const child = left ? parent.n1 : parent.n2;
      if (!isNaN(child)) {
        return child;
      } else {
        const childChild = this.findChild(parent, 
          p => left ? p.n1 : p.n2, 
          p => left ? !isNaN(p.n2) : !isNaN(p.n1));
        
        if (childChild && child != childChild) {
          return left 
            ? childChild.n2
            : childChild.n1;
        }
      }
      parent = parent.parent;
    }

    return null;
  },
  explode: function (number) {
    const numberToLeft = this.findClosest(number, true);
    if (numberToLeft) {
      numberToLeft.n1 += number.n1;
    }

    const numberToRight = this.findClosest(number, false);
    if (numberToRight) {
      numberToRight.n2 += number.n2;
    }

    if (number.parent.n1 == number) {
      number.parent.n1 = 0;
    } else {
      number.parent.n2 = 0;
    }
  },
  split: function (number, left) {
    if (left) {
      number.n1 = {
        n1: Math.floor(number.n1 / 2),
        n2: Math.ceil(number.n1 / 2),
        parent: number
      };
    } else {
      number.n2 = {
        n1: Math.floor(number.n2 / 2),
        n2: Math.ceil(number.n2 / 2),
        parent: number
      };
    }
  },
  splitRecursive(number) {
    if (!isNaN(number)) {
      return false;
    }

    if (number.n1 > 10) {
      this.split(number, true);
      return true;
    }

    if (number.n2 > 10) {
      this.split(number, false);
      return true;
    }

    return this.splitRecursive(number.n1)
      || this.splitRecursive(number.n2);
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

    return this.explodeRecursive(number.n1, nesting + 1)
      || this.explodeRecursive(number.n2, nesting + 1);
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
      pair.n1 = this.parse();
      pair.n1.parent = pair;
    } else {
      pair.n1 = parseNumber();
    }

    char = this.read(1);

    if (char == '[') {
      pair.n2 = this.parse();
      pair.n2.parent = pair;
    } else {
      pair.n2 = parseNumber();
    }

    this.read(1);
    return pair;
  }
}

module.exports = snailFish;
