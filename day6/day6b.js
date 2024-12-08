const fs = require('node:fs');
const input = fs.readFileSync('input.txt', 'utf8').trim().split('\n')

const time = Number.parseInt(input[0].replace('Time:', '').trim().replace(/\s*/g, '').trim(), 10);
const distance = Number.parseInt(input[1].replace('Distance:', '').trim().replace(/\s*/g, '').trim(), 10);

let wins = 0;
for (let wait = 0; wait <= time; wait++) {
    if ((time - wait) * wait > distance) {
        wins++;
    } 
}

console.log(wins)