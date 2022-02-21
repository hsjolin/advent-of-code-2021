const utils = require('../utils/utils');
const _stringUtil = require('../utils/stringUtil');
const parseFile = utils.parseFile;

const isNumeric = function (number) {
  return !isNaN(number);
}

var snailFish = {
  numbers: [],
  sum: '',
  stringUtil: _stringUtil,
  load: function (file, completeCallback) {
    parseFile(file, /.*/, match => {
      if (match.length != 1) {
        throw 'Invalid match ' + match
      }
      this.numbers.push(match[0]);
    },
      () => {
        this.sum = this.numbers[0];
        completeCallback(this);
      });
  },
  explode: function () {
    const stringUtil = this.stringUtil;
    let returnPosition = stringUtil.position;
    const left = parseInt(stringUtil.readUntil(c => c == ','));
    stringUtil.read(1);
    const right = parseInt(stringUtil.readUntil(c => c == ']'));
    stringUtil.read(1);
    let endPos = stringUtil.position;
    stringUtil.position = returnPosition - 1;
    stringUtil.delete(endPos - returnPosition + 1);
    stringUtil.write('0');
    returnPosition = stringUtil.position - 1;
    const positionOfRightValue = stringUtil.searchRight(c => isNumeric(c));
    if (positionOfRightValue > 0) {
      stringUtil.position = positionOfRightValue;
      let valueToRight = stringUtil.readUntil(c => !isNumeric(c));
      stringUtil.position = positionOfRightValue;
      stringUtil.delete(valueToRight.length);
      stringUtil.write((parseInt(valueToRight) + right).toString());
    }
    stringUtil.position = returnPosition;
    let positionOfLeftValue = stringUtil.searchLeft(c => isNumeric(c));
    if (positionOfLeftValue > 0) {
      stringUtil.position = positionOfLeftValue;
      stringUtil.position = stringUtil.searchLeft(c => !isNumeric(c)) + 1;
      positionOfLeftValue = stringUtil.position;
      let valueToLeft = stringUtil.readUntil(c => !isNumeric(c));
      stringUtil.position = positionOfLeftValue;
      stringUtil.delete(valueToLeft.length);
      stringUtil.write((parseInt(valueToLeft) + left).toString());
    }
  },
  split: function () {
    const stringUtil = this.stringUtil;
    let returnPosition = stringUtil.position;
    const numberToSplit = stringUtil.readUntil(c => c == ',' || c == ']');
    stringUtil.position = returnPosition;
    stringUtil.delete(numberToSplit.length);
    const left = Math.floor(parseInt(numberToSplit) / 2);
    const right = Math.ceil(parseInt(numberToSplit) / 2);
    stringUtil.write('[' + left + ',' + right + ']');
  },
  canExplode: function () {
    _stringUtil.resetPosition();
    let nesting = 0;
    while (true) {
      let char = this.stringUtil.read(1);
      if (char == null) {
        break;
      }

      if (char == '[') {
        nesting++;
      } else if (char == ']') {
        nesting--;
      }

      if (nesting > 4) {
        return true;
      }
    }

    return false;
  },
  canSplit: function () {
    _stringUtil.resetPosition();
    while (true) {
      let char = this.stringUtil.read(1);
      if (char == null) {
        break;
      }

      if (isNumeric(char) && isNumeric(_stringUtil.peek())) {
        _stringUtil.position--;
        return true;
      }
    }

    return false;
  },
  magnitude: function () {
    _stringUtil.setString(this.sum);
    while (true) {
      if (isNumeric(_stringUtil.string)) {
        break;
      }

      let char = _stringUtil.read(1);
      if (isNumeric(char)) {
        const startPos = --_stringUtil.position;
        const left = parseInt(_stringUtil.readUntil(c => !isNumeric(c)));
        _stringUtil.read(1);
        if (!isNumeric(_stringUtil.peek())) {
          continue;
        }
        const right = parseInt(_stringUtil.readUntil(c => !isNumeric(c)));
        const charsToDelete = _stringUtil.position - startPos + 2;
        const magnitude = left * 3 + right * 2;
        _stringUtil.position = startPos - 1;
        _stringUtil.delete(charsToDelete);
        _stringUtil.write(magnitude);
        _stringUtil.resetPosition();
      }
    }

    return parseInt(_stringUtil.string);
  },
  run: function (step) {
    let counter = 0;
    this.numbers.forEach(number => {
      if (number == this.sum) {
        return;
      }
      this.sum = '[' + this.sum + ',' + number + ']';
      this.stringUtil.setString(this.sum);

      while (true) {
        if (this.canExplode()) {
          this.explode();
          continue;
        }
        if (this.canSplit()) {
          this.split();
          continue;
        }
        break;
      }

      this.sum = _stringUtil.string;
      step(counter++);
    });
    
  }
}

module.exports = snailFish;
