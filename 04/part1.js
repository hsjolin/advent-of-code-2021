const utils = require("../utils/utils.js");

const readFile = utils.readFile;
const parseCommand = utils.parseCommand;
const subMarine = utils.getSubmarine();

main();

function main() {
  readFile('input.txt', fileContent => {
    const numbers = getNumbersArray(fileContent);
    // console.log(numbers);
    const boards = getBoards(fileContent);
  });
}

function getNumbersArray(text) {
  const regex = /(?:[\d]{1,2},)+[\d]{1,2}/g
  const match = text.match(regex);
  return match[0]
    .split(',')
    .map(s => parseInt(s));
}

function getBoards(text) {
  const regex = /[\d ]{14}\n[\d ]{14}\n[\d ]{14}\n[\d ]{14}\n[\d ]{14}/g
  const boards = [];
  let matches;
  while (matches = regex.exec(text)) {
    boards.push({
      id: boards.length,
      board: matches[0]
        .split('\n')
        .map(row => row.split(' ')
          .filter(s => s != '')
          .map(col => { return {
            number: parseInt(col),
            marked: false
          }})
      ),
      findNumber: function(number) {
        for(let row of this.board) {
          for(let col of row) {
            if (col.number == number) {
              return col;
            }
          }
        }
        return null;
      }
    });
  }

  return boards;
}
