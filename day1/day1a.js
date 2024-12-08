const fs = require('node:fs');
const input = fs.readFileSync('input.txt', 'utf8').trim();

console.log(input.split('\n').reduce((acc, val) => {
    const numbers = val.replaceAll(/[^0-9]/g, '');
    return acc + Number.parseInt(numbers[0] + numbers[numbers.length-1]);
}, 0));