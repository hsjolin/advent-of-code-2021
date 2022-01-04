const decoder = require('./decoder.js');

function main() {
  decoder.load('./16/input.txt', (data) => {
    draw (data.packets);
  });
}

function draw (packets) {
  console.log('Outermost value: ' + packets[0].value);
}

function versionSum(packets) {
  if (!packets) {
    return 0;
  }
  
  let sum = 0;
  packets.forEach(packet => {
    console.log(packet.header.packetVersion);
    sum += versionSum(packet.packets);
  });
  
  return sum + packets
      .map(p => p.header.packetVersion)
      .reduce((a, b) => a + b);
}

main();
