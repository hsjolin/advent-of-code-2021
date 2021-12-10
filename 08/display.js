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
          uniquePatterns: groups.slice(0, 9),
          outputs: groups.slice(10, groups.length),
          decimalValue: 0
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
          pattern: [...f].sort().join(''),
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


      // F är släckt endast för bokstaven 2
      const F = this.getCharacterF(patterns);
      patterns.filter(p => p.pattern.indexOf(F) == -1)[0].number = 2;

      // C är den andra i bokstaven 1 som inte ingår i 2


      console.log(patterns);
    });
  },
  getCharacterC(patterns) {
    const number1 = patterns.filter(p => p.number == 1);
    
  },
  getCharacterF(patterns) {
    const count = (arr, expr) => {
      return arr.filter(item => expr(item)).length
    };

    const allLetters = patterns
      .flatMap(p => [...p.pattern]);

    return allLetters
      .filter(letter => count(allLetters, l => l == letter) == 8)[0];
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
