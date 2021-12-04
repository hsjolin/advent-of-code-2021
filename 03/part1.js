const utils = require("../utils/utils.js");

const lineReader = utils.lineReader;
const parseCommand = utils.parseCommand;
const subMarine = utils.getSubmarine();

main();


function main() {
  let gamma = [];
  let epsilon = [];

  lineReader('input.txt', line => {
    [...line].forEach((s, index) => {
      gamma[index] = gamma[index] ? gamma[index] + parseInt(s) : parseInt(s);
    });
  }, (lines) => {
    const limit = lines.length / 2;

    gamma = gamma.map(s => {
      return s > limit ? 1 : 0;
    });

    epsilon = gamma.map(s => {
      return s == 1 ? 0 : 1;
    });

    const epsilonDec = parseInt(epsilon.join(''), 2);
    const gammaDec = parseInt(gamma.join(''), 2);

    console.log('gamma: ' + gamma.join('') + '=' + gammaDec);
    console.log('epsilon: ' + epsilon.join('') + '=' + epsilonDec);
    console.log('gamma*epsilon=' + gammaDec*epsilonDec);
  });
}
