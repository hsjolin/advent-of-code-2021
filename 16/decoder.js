const utils = require('../utils/utils');
const parseFile = utils.parseFile;

// Object.defineProperty(String.prototype, 'take', {
//   value: function (length) {
//       let str = this.substring(0, length);
//       this = this.substring(length);
//       return str;
//   }, 
//   writable: true
// });

var decoder = {
  packets: [],
  load: function (file, completeCallback) {
    parseFile(file, /[A-F0-9]+/, match => {
      if (match.length != 1) {
        throw 'Invalid match ' + match
      }

      this.packets = this.parse(match[0]);
    },
      () => {
        completeCallback(this);
      });
  },
  parse: function (hexString) {
    return this.parseBinary(this.toBinaryString(hexString));
  },
  parseBinary: function (binaryString) {
    let header = this.getHeader(binaryString);
    const packets = [];

    while (header != null) {
      const packet = this.getPacket(header, binaryString);
      packet.header = header;
      binaryString = binaryString.substring(packet.length + header.length);
      packets.push(packet);
      header = this.getHeader(binaryString);
    }
    return packets;
  },
  parseSingleBinary: function (binaryString) {
    let header = this.getHeader(binaryString);

    if (header != null) {
      const packet = this.getPacket(header, binaryString);
      packet.header = header;
      return packet;
    }

    return null;
  },
  getHeader: function (string) {
    if (string == '' || parseInt(string, 2) == 0) {
      return null;
    }

    const packetVersion = parseInt(string.substring(0, 3), 2);
    const packetTypeId = parseInt(string.substring(3, 6), 2);

    let parse = null;
    switch (packetTypeId) {
      case 4:
        parse = this.parseLiteral;
        break;
      default:
        parse = this.parseOperator;
    }

    return {
      decoder: this,
      packetTypeId,
      packetVersion,
      parse,
      length: 6
    }
  },
  toBinaryString: function (hexString) {
    let binaryString = '';
    for (const char of hexString) {
      binaryString += parseInt(char, 16).toString(2).padStart(4, '0');
    }

    return binaryString;
    // const toBin = (hex) => {
    //   return (parseInt(hex, 16).toString(2)).padStart(4, '0');
    // }

    // return toBin(hexString);
  },
  getPacket: function (header, string) {
    return header.parse(string);
  },
  parseLiteral: function (string) {
    const str = string.substring(6);
    let literalValue = '';
    let length = 0;
    for (let i = 0; i < string.length; i += 5) {
      let group = str.substring(i, i + 5);
      literalValue += group.substring(1);
      if (group[0] == '0') {
        length = i + 5;
        break;
      }
    }

    return {
      value: parseInt(literalValue, 2),
      length: length
    }
  },
  parseOperator: function (string) {
    let str = string.substring(6);
    const lengthTypeId = parseInt(str[0]);
    str = str.substring(1);

    let length = 0;
    let packets = [];
    switch (lengthTypeId) {
      case 0: {
        length = parseInt(str.substring(0, 15), 2);
        str = str.substring(15);

        packets = this.decoder.parseBinary(str.substring(0, length));

        return {
          length: length + 15 + 1,
          packets,
          lengthTypeId
        }
      }
      case 1: { 
        const numberOfPackets = parseInt(str.substring(0, 11), 2);
        str = str.substring(11);

        for (let i = 0; i < numberOfPackets; i++) {
          const packet = this.decoder.parseSingleBinary(str);
          str = str.substring(packet.length + packet.header.length);
          length += packet.length + packet.header.length;
          packets.push(packet);
        }

        return {
          length: length + 12 + 1,
          packets,
          lengthTypeId
        }
      }
    }
  },
}

module.exports = decoder;
