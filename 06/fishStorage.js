var fishStorage = {
  storageCount: 0,
  newborns: 0,
  breeded: 0,
  storage: [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
  ],
  push: function(fishIndex, count) {
    if (!count) {
      count = 1;
    }

    if (fishIndex == 8) {
      this.newborns += count;
    } else if (fishIndex == 6) {
      this.breeded += count;
    } else {
      this.storage[fishIndex] += count;
    }
  },
  pop: function() {
    if (this.storage[0] == 0) {
      return null;
    }

    let breedable = this.storage[0];
    this.storage[0] = 0;

    return breedable;
  },
  commit: function() {
    if (this.storage[0] > 0) {
      throw this.storage[0] + " fishes left!"
    }

    this.storage.splice(0, 1);
    this.storage.push(this.newborns);
    this.storage[6] += this.breeded;
    this.newborns = 0;
    this.breeded = 0;
    this.storageCount = this.storage.reduce((x, y) => x + y, 0);
  },
}

module.exports = fishStorage;
