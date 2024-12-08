const fs = require('node:fs');
const { default: test } = require('node:test');
const input = fs.readFileSync('input.txt', 'utf8').trim().split('\n\n')

const connections = {};
input[1].split('\n').forEach(conn => {
    const m = /^([0-9A-Z]{3}) \= \(([0-9A-Z]{3}), ([0-9A-Z]{3})\)/.exec(conn);
    connections[m[1]] = [ m[2], m[3] ];
});

const directions = input[0].trim().split('').map(d => d === 'L' ? 0 : 1);
const dirLength = directions.length;

const startRegex = /^..A$/;
const endRegex = /^..Z$/;

const positions = Object.keys(connections).filter(c => startRegex.test(c));
const positionsSteps = [];

// Find number of steps between circles
// NB: Tested, steps between start to end 
//     is similar to end to end
positions.forEach((startPos) => {
    let pos = startPos;
    step = 0;
    while(!endRegex.exec(pos)) {
        const dir = directions[step % dirLength];
        pos = connections[pos][dir];
        step++;
    }
    positionsSteps.push(step)
})

// Find Greatest Common Divisor (recursive)
const gcd = (a, b) => {
    return b == 0 
        ? a 
        : gcd(b, a % b)
} 

// Find Least Common Multiple
const lcm = (a, b) =>  a / gcd (a, b) * b


const lcm2 = (a, b) => {
    let lar = Math.max(a, b)
    let small = Math.min(a, b)

    for (let i = lar; ; i += lar) {
        if (i % small == 0) return i
    }
}
// Now find them accros steps
console.log(positionsSteps.reduce(lcm, 1));
console.log(positionsSteps.reduce(lcm2, 1));