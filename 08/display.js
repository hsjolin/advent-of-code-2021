const utils = require("../utils/utils.js");
const parseFile = utils.parseFile;

const displayTemplate = `
\t n:
\t aaaa
\tb    c
\tb    c
\t dddd
\te    f
\te    f
\t gggg
`;

const displayTemplate2 = `
\t n:     n:     n:     n:
\t a0a0a0a0   a1a1a1a1   a2a2a2a2   a3a3a3a3
\tb0    c0 b1    c1 b2    c2 b3    c3
\tb0    c0 b1    c1 b2    c2 b3    c3
\t d0d0d0d0   d1d1d1d1   d2d2d2d2   d3d3d3d3
\te0    f0 e1    f1 e2    f2 e3    f3
\te0    f0 e1    f1 e2    f2 e3    f3
\t g0g0g0g0   g1g1g1g1   g2g2g2g2   g3g3g3g3
`;

var display = {
  data: [],
  load: function(file, completeCallback) {
    parseFile(
      file,
      /([a-z ]+) ([a-z ]+) ([a-z ]+) ([a-z ]+) ([a-z ]+) ([a-z ]+) ([a-z ]+) ([a-z ]+) ([a-z ]+) ([a-z ]+) \| ([a-z ]+) ([a-z ]+) ([a-z ]+) ([a-z ]+)/,
      match => {
        if (match.length != 15) {
          throw 'Invalid line detected. Expected 15 matches but found ' + match.length;
        }

        const groups = match.slice(1, match.length);

        return {
          uniquePatterns: groups.slice(0, 10).map(p => [...p].sort().join('')),
          outputs: groups.slice(10, groups.length).map(p => [...p].sort().join('')),
          value: 0
        };
      },
      results => {
        this.data = results;
        completeCallback();
      }
    )
  },
  verifyData: function() {
    this.data.forEach(item => {
      const patterns = item.uniquePatterns.map(f => {
        return {
          pattern: f,
          number: null,
          length: f.length
        }
      });

      // Bokstaven 1 består av två bokstäver
      patterns.filter(p => p.length == 2)[0].number = 1;
      // Bokstaven 4 består av fyra bokstäver
      patterns.filter(p => p.length == 4)[0].number = 4;
      // Bokstaven 7 består av tre bokstäver
      patterns.filter(p => p.length == 3)[0].number = 7;
      // Bokstaven 8 består av sju bokstäver
      patterns.filter(p => p.length == 7)[0].number = 8;

      // F saknas endast i bokstaven 2
      const F = this.getCharacterF(patterns);
      patterns.filter(p => p.pattern.indexOf(F) == -1)[0].number = 2;

      // C är bokstaven i 1 som inte är F
      const C = patterns.filter(p => p.number == 1)[0].pattern.replace(F, '');

      // C saknas i bokstaven 6
      const number6 = patterns.filter(p => p.length == 6 && p.pattern.indexOf(C) == -1)[0];
      number6.number = 6;

      const patternsWith6Numbers = patterns.filter(p => p.length == 6);
      const compareStrings = (str1, str2) => {
        let counter = 0;
        for (const char of str1) {
          if (str2.indexOf(char) == -1) {
            counter++;
          }
        }

        return counter;
      }

      // Bokstav 4 ingår helt i bokstav 9
      const number4 = patterns.filter(p => p.number == 4)[0];
      const number9 = patternsWith6Numbers
        .filter(p => compareStrings(number4.pattern, p.pattern) == 0)[0];
      number9.number = 9;

      // Bokstaven 0 är den med 6 bokstäver som är kvar
      const number0 = patternsWith6Numbers.filter(p => !p.number)[0];
      number0.number = 0;

      // C ingår i bokstaven 3
      patterns.filter(p => p.length == 5 && p.pattern.indexOf(C) > -1 && !p.number)[0].number = 3;
      // Bokstaven 5 är den som är kvar
      patterns.filter(p => p.length == 5 && p.pattern.indexOf(C) == -1 && !p.number)[0].number = 5;

      item.value = parseInt(item.outputs
        .map(output => patterns.filter(p => p.pattern == output)[0].number)
        .join(''));
    });
  },
  getCharacterF(patterns) {
    const count = (arr, expr) => {
      return arr.filter(item => expr(item)).length;
    };

    const allLetters = patterns
      .flatMap(p => [...p.pattern]);

    return allLetters
      .filter(letter => count(allLetters, l => l == letter) == 9)[0];
  },
  part1: function() {
    return this.data
      .flatMap(item => item.outputs)
      .filter(output => output.length == 2
        || output.length == 4
        || output.length == 3
        || output.length == 7)
      .length;
  },
  part2: function() {
    // console.log(this.data);
    return this.data
      .map(item => item.value)
      .reduce((a, b) => a + b);
  },
  draw: function() {
    this.data.forEach((item) => {
      let display = displayTemplate2;
      item.outputs.forEach((output, n) => {
        [...output].forEach((chr) => {
          display = display.replace(new RegExp(chr + n, 'g'), '*');
        });

        display = display.replace('n', n);
        ['a', 'b', 'c', 'd', 'e', 'f', 'g'].forEach((chr) => {
          display = display.replace(new RegExp(chr + n, 'g'), ' ');
        });
      });

      console.log(display);
    });
  }
}

module.exports = display;
