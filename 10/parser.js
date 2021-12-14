const utils = require("../utils/utils.js");
const lineReader = utils.lineReader;

var parser = {
  points: 0,
  points2: 0,
  currentLine: null,
  load: function(file, completeCallback) {
    lineReader(
      file,
      line => {
        // this.currentLine = line;
        // let indexes = '';
        // for (let i = 0; i < line.length; i++) {
        //   indexes += i < 10 
        //     ? '0' + i + ' '
        //     : i + ' ';
        // }
        // console.log(indexes);
        // console.log([...line].join('  '));

        try {
          this.parseRecursive(0);
          console.log(this.currentLine);
        } catch (error) {
          // console.log(error + ' - Line: ' + line);
          // console.log('');
        }
      },
      results => {
        console.log(this.points);
        console.log(this.points2);
        completeCallback();
      }
    )
  },
  parseRecursive: function (currentIndex) {
    let expr = this.currentLine;

    if (expr.length <= currentIndex) {
      // console.log('Reached EOL.');
      return -1;
    }

    const currentChar = expr[currentIndex];
    if (this.isClosingBracket(currentChar)) {
      return currentIndex;
    }

    const expectedClosingBracket = this.getClosingBracketFor(currentChar);
    let closingBracketIndex = this.parseRecursive(expr, currentIndex + 1);

    if (closingBracketIndex == -1) {
      // Incomplete line.
      closingBracketIndex = expr.length;
      expr = expr + expectedClosingBracket;
      this.calculatePoints2(expectedClosingBracket);
    }

    const closingBracket = expr[closingBracketIndex];

    if (closingBracket != expectedClosingBracket) {
      this.calculatePoints(closingBracket);
      throw 'Syntax error on index ' + currentIndex + '. Expected \'' 
        + expectedClosingBracket + '\' got the \'' + closingBracket + '\' on index ' + closingBracketIndex;
    } else {
      // console.log('Found a chunk on index ' + currentIndex + ', ' + closingBracketIndex + ': ' 
      //   + expr.substring(currentIndex, closingBracketIndex + 1));
    }

    return this.parseRecursive(expr, closingBracketIndex + 1);
  },
  part1: function() {
  },
  part2: function() {
  },
  isClosingBracket: char => {
    return ")]}>".indexOf(char) > -1;
  },
  getClosingBracketFor: (char) => {
    switch (char) {
      case '(': 
        return ')';
      case '[':
        return ']';
      case '{':
        return '}';
      case '<':
        return '>';
      default:
        throw 'Invalid character found: \'' + char + '\'';
    }
  },
  calculatePoints: function (char) {
    if(char ==  ')') {
      this.points += 3;
    } else if (char == ']') {
      this.points += 57;
    } else if (char == '}') {
      this.points += 1197;
    } else if (char == '>') {
      this.points += 25137;
    }
  },
  calculatePoints2: function (char) {
    if(char ==  ')') {
      this.points2 += 1;
    } else if (char == ']') {
      this.points2 += 2;
    } else if (char == '}') {
      this.points2 += 3;
    } else if (char == '>') {
      this.points2 += 4;
    }
  }
}

module.exports = parser;
