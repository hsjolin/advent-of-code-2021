const octopus = require('./octopus.js');
let arr = [];

function main() {
  octopus.load('./11/input.txt', (data) => {
    arr = data;
    octopus.tick(data => {
      arr = data;
      draw();
    });

    octopus.start(9999999);
  })
}

function draw() {
  console.clear();
  console.log('Flashcount: ' + octopus.flashCount)
  console.log('Iteration: ' + octopus.iteration)
  console.log(
    arr
      .map(row => row
        .map(o => {
          if (o.value == 0) {
            return '*';
          }

          return o.value
        })
        .join(' '))
      .join('\r\n')
  );
}

main();
