const utils = require("../utils/utils.js");
const lineReader = utils.lineReader;

var parser = {
  points: 0,
  points2: 0,
  currentLine: null,
  load: function(file, completeCallback) {
    let lineScores = [];
    lineReader(
      file,
      line => {
        this.currentLine = line;
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
          lineScores.push(this.points2);
          this.points2 = 0;
        } catch (error) {
          console.log(error + ' - Line: ' + line);
          console.log('');
        }
      },
      results => {
        console.log(this.points);
        lineScores.sort((a, b) => {
          return a - b;
        });
        console.log(lineScores
          .slice(lineScores.length / 2, lineScores.length / 2 + 1)[0]);

        completeCallback();
      }
    )
  },
  parseRecursive: function (currentIndex) {
    if (this.currentLine.length <= currentIndex) {
      // console.log('Reached EOL.');
      return -1;
    }

    const currentChar = this.currentLine[currentIndex];
    if (this.isClosingBracket(currentChar)) {
      return currentIndex;
    }

    let closingBracketIndex = this.parseRecursive(currentIndex + 1);
    const expectedClosingBracket = this.getClosingBracketFor(currentChar);

    if (closingBracketIndex == -1) {
      // Incomplete line.
      closingBracketIndex = this.currentLine.length;
      this.currentLine += expectedClosingBracket;
      this.calculatePoints2(expectedClosingBracket);
    } 

    const closingBracket = this.currentLine[closingBracketIndex];

    if (closingBracket != expectedClosingBracket) {
      this.calculatePoints(closingBracket);
      throw 'Syntax error on index ' + currentIndex + '. Expected \'' 
        + expectedClosingBracket + '\' got the \'' + closingBracket + '\' on index ' + closingBracketIndex;
    } else {
      // console.log('Found a chunk on index ' + currentIndex + ', ' + closingBracketIndex + ': ' 
      //   + this.currentLine.substring(currentIndex, closingBracketIndex + 1));
    }

    return this.parseRecursive(closingBracketIndex + 1);
  },
  part1: function() {
  },
  part2: function() {
  },
  isClosingBracket: function(char) {
    return ")]}>".indexOf(char) > -1;
  },
  getClosingBracketFor: function(char) {
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
        throw 'getClosingBracketFor: Invalid character found: \'' + char + '\'';
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
    } else {
      throw 'calculatePoints: Invalid character found: \'' + char + '\'';
    }
  },
  calculatePoints2: function (char) {
    this.points2 = this.points2 * 5;
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
