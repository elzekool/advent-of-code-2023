const fs = require('node:fs');
const input = fs.readFileSync('input.txt', 'utf8').trim().split('\n')

const times = input[0].replace('Time:', '')
    .trim().split(' ').map(t => t.trim()).filter(t => t !== '').map(t => Number.parseInt(t, 10));

const distances = input[1].replace('Distance:', '')
    .trim().split(' ').map(d => d.trim()).filter(d => d !== '').map(d => Number.parseInt(d, 10));

const raceWins = [];

for (let race = 0; race < times.length; race++) {
    const time = times[race];
    const distance = distances[race];
    let wins = 0;
    for (let wait = 0; wait <= time; wait++) {
        if ((time - wait) * wait > distance) {
            wins++;
        } 
    }
    raceWins.push(wins);
}

console.log(raceWins.reduce((acc, val) => acc*val, 1));