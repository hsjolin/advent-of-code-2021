const utils = require("../utils/utils.js");
const bingoEngine = require("./bingoEngine.js");
const readFile = utils.readFile;

main();

function main() {
  readFile('input.txt', fileContent => {
    const numbers = bingoEngine.getNumbersArray(fileContent);
    const boards = bingoEngine.getBoards(fileContent);
    for(let number of numbers) {
      for(let board of boards) {
        board.mark(number);
        if (board.hasBingo()) {
          console.log(board.id + ' got BINGO!');
          console.log('Score: ' + board.getScore(number));
          return;
        }
      }
    }
  });
}
