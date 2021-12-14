const utils = require("../utils/utils.js");

const lineReader = utils.lineReader;

var parser = {
  chunks: [],
  load: function(file, completeCallback) {
    lineReader(
      file,
      line => {
        try {
          console.log(this.parseRecursive(line, 0, 0));
        } catch (error) {
          console.log('Error on line ' + line, error);
        }
      },
      results => {
        completeCallback();
      }
    )
  },
  parseRecursive: function (expr, currentIndex) {
    const chunks = [];
    
    let openingBracket = expr[currentIndex];
    if (this.isClosingBracket(openingBracket)) {
      throw 'Expected a opening bracket but found \'' + expr[currentIndex] + '\'';
    }

    let expectedClosingBracket = this.getClosingBracketFor(openingBracket);
    if (expr.length == currentIndex + 1) {
      throw 'This row is incomplete. Expected a \'' + expectedClosingBracket 
        + '\' or an opening bracket but got nothing. Line: ' + expr;
    }

    for (let i = currentIndex; i < expr.length; i++) {
      let char = expr[i + 1];
      
      if (this.bracketsEqualish(openingBracket, char)) {
        chunks.push(openingBracket + '' + expectedClosingBracket);
        break;
      } else if (!this.isClosingBracket(char)) {
        chunks.push(...this.parseRecursive(expr, currentIndex + 1));
      } else {
        throw 'Syntax error on index ' + (currentIndex + i) + '. Expected \'' 
        + expectedClosingBracket + '\' got \'' + char + '\'';
      }
    }

    return chunks;
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
  bracketsEqualish: (a, b) => {
    return a == '(' && b == ')'
      || a == '[' && b == ']'
      || a == '{' && b == '}'
      || a == '<' && b == '>';
  }
}

module.exports = parser;
