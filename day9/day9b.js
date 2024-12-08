const fs = require('node:fs');
const input = fs.readFileSync('input.txt', 'utf8').trim().split('\n')

const resolve = (numbers) => {
    if (numbers.filter(n => n !== 0).length === 0) {
        return 0;
    }

    let first = numbers[0];
    let newNumbers = [];
    let prev = numbers.shift();
    numbers.forEach((n) => {
        newNumbers.push(n-prev);
        prev = n;
    });

    const result = resolve(newNumbers)
    return first - result;
}

let sum = 0;
input.forEach((line) => {
    const numbers = line.split(/\s+/).map(n => Number.parseInt(n, 10));
    const result = resolve(numbers);
    sum += result;
})

console.log(sum);