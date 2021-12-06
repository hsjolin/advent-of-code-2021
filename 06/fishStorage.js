const utils = require("../utils/utils.js");
const lineReader = utils.lineReader;
const fileWriter = utils.fileWriter;
const appendFile = utils.appendFile;
const replaceFile = utils.replaceFile;

var fishStorage = {
  storageCount: 0,
  transCount: 0,
  storage: [],
  trans: [],
  maxLength: 100000,
  // maxLength: 2147483646,
  push: function(fish) {
    this._push(fish);
  },
  pop: function() {
    return this._pop();
  },
  commit: function() {
    this.storage = this.trans;
    this.trans = null;
    this.storageCount = this.transCount;
    this.transCount = 0;
  },
  _push: function(fish) {
    if (this.trans == null) {
      this.trans = [];
    }

    let storageArr = this.trans;

    if (storageArr.length == 0) {
      storageArr.push([]);
    }

    let currentIndex = storageArr.length - 1;
    let currentArr = storageArr[currentIndex];
    if (currentArr.length >= this.maxLength) {
      currentArr = [];
      storageArr.push(currentArr);
      currentIndex++;
    }

    this.transCount++;
    currentArr.push(fish);
  },
  _pop: function() {
    if (this.storageCount == 0) {
      return null;
    }

    let storageArr = this.storage;
    let currentIndex = storageArr.length - 1;
    let currentArr = storageArr[currentIndex];
    if (currentArr.length == 0) {
      storageArr.pop();
      currentIndex--;
      if (currentIndex == 0) {
        return null;
      }

      currentArr = storageArr[currentIndex];
    }

    this.storageCount--;
    return currentArr.pop();
  }
}

module.exports = fishStorage;
