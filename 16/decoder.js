const utils = require('../utils/utils');
const parseFile = utils.parseFile;

var decoder = {
  packets: [],
  binaryString: '',
  load: function (file, completeCallback) {
    parseFile(file, /[A-F0-9]+/, match => {
      if (match.length != 1) {
        throw 'Invalid match ' + match
      }

      this.binaryString = this.toBinaryString(match[0]);
      this.packets = this.parseBinary();
    },
      () => {
        completeCallback(this);
      });
  },
  read: function (num) {
    const str = this.binaryString.substring(0, num);
    this.binaryString = this.binaryString.substring(num);
    return str;
  },
  parseBinary: function () {
    let packet = this.parseSinglePacket();
    const packets = [];

    while (packet != null) {
      packets.push(packet);
      packet = this.parseSinglePacket();
    }

    return packets;
  },
  parseSinglePacket: function () {
    let header = this.getHeader();

    if (header != null) {
      const packet = this.getPacket(header);
      packet.header = header;
      packet.value = this.calculatePacketValue(packet);

      return packet;
    }

    return null;
  },
  getHeader: function () {
    if (this.binaryString == '' || parseInt(this.binaryString, 2) == 0) {
      return null;
    }

    const packetVersion = parseInt(this.read(3), 2);
    const packetTypeId = parseInt(this.read(3), 2);

    return {
      packetTypeId,
      packetVersion,
      length: 6
    }
  },
  toBinaryString: function (hexString) {
    let binaryString = '';
    for (const char of hexString) {
      binaryString += parseInt(char, 16).toString(2).padStart(4, '0');
    }

    return binaryString;
  },
  getPacket: function (header) {
    switch (header.packetTypeId) {
      case 4:
        return this.parseLiteral();
      default:
        return this.parseOperator();
    }
  },
  parseLiteral: function () {
    let literalValue = '';
    let length = 0;
    let group = this.read(5);

    while (true) {
      literalValue += group.substring(1);
      length += 5;
      if (group[0] == '0') {
        break;
      }

      group = this.read(5);
    }

    return {
      value: parseInt(literalValue, 2),
      length: length
    }
  },
  parseOperator: function () {
    const lengthTypeId = parseInt(this.read(1));
    let packet = null;

    switch (lengthTypeId) {
      case 0: {
        let length = parseInt(this.read(15), 2);
        let originalLength = length;
        let packets = [];
        while (length > 0) {
          let packet = this.parseSinglePacket();
          packets.push(packet);

          length -= packet.header.length + packet.length;
        }

        packet = {
          length: originalLength + 15 + 1,
          packets,
          lengthTypeId
        }
        break;
      }
      case 1: {
        const numberOfPackets = parseInt(this.read(11), 2);
        let length = 0;
        let packets = [];

        for (let i = 0; i < numberOfPackets; i++) {
          const packet = this.parseSinglePacket();
          length += packet.length + packet.header.length;
          packets.push(packet);
        }

        packet = {
          length: length + 12 + 1,
          packets,
          lengthTypeId
        }
        break;
      }
    }

    return packet;
  },
  calculatePacketValue: function (packet) {
    switch (packet.header.packetTypeId) {
      case 0:
        return packet.packets.map(p => p.value).reduce((a, b) => a + b);
      case 1:
        return packet.packets.map(p => p.value).reduce((a, b) => a * b);
      case 2:
        return Math.min(...packet.packets.map(p => p.value));
      case 3:
        return Math.max(...packet.packets.map(p => p.value));
      case 4:
        return packet.value;
      case 5:
        return packet.packets[0].value > packet.packets[1].value ? 1 : 0;
      case 6:
        return packet.packets[0].value < packet.packets[1].value ? 1 : 0;
      case 7:
        return packet.packets[0].value == packet.packets[1].value ? 1 : 0;
      default:
        throw 'Unknown packetTypeId: ' + packet.header.packetTypeId 
      }
  }
}

module.exports = decoder;
