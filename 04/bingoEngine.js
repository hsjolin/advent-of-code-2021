const utils = require("../utils/utils.js");
const readFile = utils.readFile;

module.exports = class BingoEngine {
  static getNumbersArray(text) {
    const regex = /(?:[\d]{1,2},)+[\d]{1,2}/g
    const match = text.match(regex);
    return match[0]
      .split(',')
      .map(s => parseInt(s));
  }

  static drawBoard(board) {
    let output = '';
    for(let row of board.board) {
      for(let col of row) {
        col.marked
          ? output += '['
          : output += ' '
        output += col.number > 9
          ? col.number
          : ' ' + col.number
          col.marked
            ? output += ']'
            : output += ' '
      }
      output += '\r\n';
    }

    console.log(output);
  }

  static getBoards(text) {
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
            }})),
        findNumber: function(number) {
          for(let row of this.board) {
            for(let col of row) {
              if (col.number == number) {
                return col;
              }
            }
          }
          return null;
        },
        mark: function(number) {
          const numberObj = this.findNumber(number);
          if (!numberObj) {
          	return;
          }

          numberObj.marked = true;
        },
        hasBingo: function() {
          // Check horizontal
          for(let row of this.board) {
            let marked = row.filter(col => col.marked);
            if (marked.length == 5) {
              return true;
            }
          }

          // Check vertical
          for(let colIndex = 0; colIndex < this.board.length; colIndex++) {
            let marked = this.board.map(row => row[colIndex]).filter(col => col.marked);
            if (marked.length == 5) {
              return true;
            }
          }
        },
        getScore: function(winningNumber) {
          let score = 0;

          for(let row of this.board) {
            for(let col of row) {
              if (!col.marked) {
                score += col.number;
              }
            }
          }

          return score * winningNumber;
        }
      });
    }

    return boards;
  }
}
