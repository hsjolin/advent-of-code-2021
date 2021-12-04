const utils = require("../utils/utils.js");

const lineReader = utils.lineReader;
const parseCommand = utils.parseCommand;
const subMarine = utils.getSubmarine();

main();


function main() {
  lineReader('input.txt', line => {

  }, (lines) => {
    const ogr = findOxygenGeneratorRating(lines, 0);
    const csr = findCO2ScrubberRating(lines, 0);

    console.log('ogr: ' + ogr);
    console.log('csr: ' + csr);
    console.log('Life support rating: ' + parseInt(ogr, 2) * parseInt(csr, 2));
  });
}

function getCountArr(lines) {
  let count = [];
  lines.forEach(line => {
    [...line].forEach((s, index) => {
      count[index] = count[index] ? count[index] + parseInt(s) : parseInt(s);
    });
  });

  return count;
}

function findOxygenGeneratorRating(lines, index) {
  if (lines.length == 1) {
    return lines[0];
  } else if (lines.length == 0) {
    throw "lines.length is zero!";
  }

  let countArr = getCountArr(lines);
  const oneCount = countArr[index];
  const zeroCount = lines.length - oneCount;
  const filterBit = oneCount >= zeroCount ? 1 : 0;
  console.log(countArr);

  return findOxygenGeneratorRating(lines.filter(line => line[index] == filterBit), index + 1);
}

function findCO2ScrubberRating(lines, index) {
  if (lines.length == 1) {
    return lines[0];
  } else if (lines.length == 0) {
    throw "lines.length is zero!";
  }

  let countArr = getCountArr(lines);
  const oneCount = countArr[index];
  const zeroCount = lines.length - oneCount;
  const filterBit = oneCount >= zeroCount ? 0 : 1;

  return findCO2ScrubberRating(lines.filter(line => line[index] == filterBit), index + 1);
}
