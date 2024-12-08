const fs = require('node:fs');
const input = fs.readFileSync('input.txt', 'utf8').trim().split('\n\n')

const connections = {};
input[1].split('\n').forEach(conn => {
    const m = /^([A-Z]{3}) \= \(([A-Z]{3}), ([A-Z]{3})\)/.exec(conn);
    connections[m[1]] = [ m[2], m[3] ];
});

const directions = input[0].trim().split('').map(d => d === 'L' ? 0 : 1);
const dirLength = directions.length;

let pos = 'AAA';
let step = 0;

while (pos !== 'ZZZ') {
    const dir = directions[step % dirLength];
    pos = connections[pos][dir];
    step++;
}

console.log(step);