const pathEngine = require('./paths.js');
let arr = [];

function main() {
  pathEngine.load('./12/test.txt', (data) => {
    console.log(pathEngine.evaluate());
  });
}

main();
