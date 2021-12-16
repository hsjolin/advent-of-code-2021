const pathEngine = require('./paths.js');
let arr = [];

function main() {
  pathEngine.load('./12/input.txt', (data) => {
    const paths = pathEngine.evaluate();
    console.log(paths.join('\n'));
    console.log('Total number of paths: ' + paths.length);
  });
}

main();
