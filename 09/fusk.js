const fs = require('fs');
const rawData = fs.readFileSync(__dirname + '/input.txt').toString();
const data = rawData.split(/\r?\n/)

let mapping = []

let dumbData = Array(data[0].length + 2)
dumbData.fill('^')
mapping.push(dumbData)

for (let j = 0; j < data.length; j++) {
    let rows = []
    rows.push('^')
    for (let i = 0; i < data[j].length; i++) {
        let row = data[j][i] == '9' ? '^' : '_'
        rows.push(row)
    }
    rows.push('^')
    mapping.push(rows)
}
mapping.push(dumbData)


let basins = []
for (let i = 1; i < mapping.length - 1; i++) {
    for (let j = 1; j < mapping[i].length - 1; j++) {
        if (mapping[i][j] == '_') {
            let count = findBasin(i, j, 0) + 1
            basins.push(count)
        }
    }
}
let output = ''
for (let i = 0; i < mapping.length; i++) {
    for (let j = 0; j < mapping[i].length; j++) {
        output += mapping[i][j].toString()
    }
    output += '\r\n'
}
console.log(output)
basins.sort((a, b) => a < b ? 1 : -1);
console.log(basins.slice(0, 3));
console.log(basins.slice(0, 3).reduce((x, y) => x * y))

function findBasin(i, j, count) {
    mapping[i][j] = '-'
    if (
        mapping[i - 1][j] != '_'
        && mapping[i][j - 1] != '_'
        && mapping[i][j + 1] != '_'
        && mapping[i + 1][j] != '_'
    ) {
        return count
    }
    else {
        if (mapping[i - 1][j] == '_') {
            count += 1
            count = findBasin(i - 1, j, count)
        }
        if (mapping[i + 1][j] == '_') {
            count += 1
            count = findBasin(i + 1, j, count)
        }
        if (mapping[i][j - 1] == '_') {
            count += 1
            count = findBasin(i, j - 1, count)
        }
        if (mapping[i][j + 1] == '_') {
            count += 1
            count = findBasin(i, j + 1, count)
        }
    }
    return count;
}
