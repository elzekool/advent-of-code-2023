const fs = require('node:fs');
const input = fs.readFileSync('input.txt', 'utf8').trim();

let score = 0;

input.split('\n').forEach((line) => {
    let [ card, numbers ] = line.split(':');
    // card = Number.parseInt(card.replace(/^Card\s*/, ''), 10);
    const [ winning, drawn ] = numbers.split('|').map(n => n.trim().split(/\s+/));
    const matching = [ ...new Set(drawn) ].filter(c => winning.indexOf(c) !== -1)

    let cardScore = 0;
    if (matching.length > 0) {
        cardScore = 1;
        for(let x = 0; x < matching.length-1; x++) {
            cardScore *= 2;
        }
        score += cardScore;
    }
});

console.log(score)

