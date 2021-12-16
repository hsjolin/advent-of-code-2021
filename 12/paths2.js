const utils = require('../utils/utils.js');
const parseFile = utils.parseFile;

var pathEngine = {
  caves: [],
  load: function (file, completeCallback) {
    parseFile(file, /([A-Za-z]+)-([A-Za-z]+)/, match => {
      if (match.length != 3) {
        throw 'Invalid match ' + match
      }

      let from = this.caves.find(cave => cave.name == match[1]);
      let to = this.caves.find(cave => cave.name == match[2]);

      if (!from) {
        from = {
          name: match[1],
          connections: [],
          multipleVisits: match[1].toUpperCase() == match[1]
        };

        this.caves.push(from);
      }

      if (!to) {
        to = {
          name: match[2],
          connections: [],
          multipleVisits: match[2].toUpperCase() == match[2]
        };

        this.caves.push(to);
      }

      to.connections.push(from);
      from.connections.push(to);
    },
      () => {
        completeCallback(this.caves);
      });
  },
  evaluate: function () {
    const startPoint = this.caves.find(cave => cave.name == 'start');
    const endPoint = this.caves.find(cave => cave.name == 'end');

    const paths = this.findPaths(startPoint, endPoint, startPoint.name, true);
    return paths;
  },
  findPaths(current, end, path, extraVisit) {
    if (current == end) {
      return [path];
    }

    const availableCaves = current.connections.filter(c =>
      path.indexOf(c.name) > -1 && c.multipleVisits
      || path.indexOf(c.name) == -1);

    const extra = extraVisit
      ? current.connections.filter(c =>
        path.indexOf(c.name) > -1 && !c.multipleVisits && c.name != 'start' && c.name != 'end')
      : [];

    const paths = [];
    for (cave of availableCaves) {
      const p = this.findPaths(cave, end, [path, cave.name].join('-'), extraVisit);
      paths.push(...p);
    }

    for (cave of extra) {
      const p = this.findPaths(cave, end, [path, cave.name].join('-'), false);
      paths.push(...p);
    }

    return paths;
  }
}

module.exports = pathEngine;
