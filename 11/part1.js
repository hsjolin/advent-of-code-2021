const parser = require("./parser.js");
const kit = require('terminal-kit');
const term = kit.terminal;
const document = term.createDocument();

const arr = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
];

const table = new kit.TextTable ({
  cellContents: arr,
  hasBorder: false,
  parent: document,
  // contentHasMarkup: true,
  // borderChars: 'lightRounded',
  // borderAttr: { color: 'blue' },
  // textAttr: { bgColor: 'default' },
  // firstCellTextAttr: { bgColor: 'red' },
  // firstRowTextAttr: { bgColor: 'yellow' },
  // firstColumnTextAttr: { bgColor: 'red' },
  width: 50,
  height: 20,
  fit: true   // Activate all expand/shrink + wordWrap
});

function main() {
  term.green('Hit CTRL-C to quit.\n\n');
  term.grabInput();
  term.clear();
  draw();
  // draw();
  // parser.load('./10/input.txt', () => {
  //   console.log(parser.part1());
  // });
}

function draw() {
  // term.table(arr, table);
  // console.log(table.cellContents[1][1]);
  // table.setCellContent(1, 1, 8);
  // console.log(table.cellContents[1][1]);
  // table.computeCells();
  // table.draw();
  document.draw();
}

function terminate() {
  term.clear();
  term.grabInput(false);
  console.log('Bye 😥');
  setTimeout(function () { process.exit() }, 100);
}

term.on('key', function (name, matches, data) {
  if (name === 'CTRL_C') {
    terminate();
  }
});

main();
