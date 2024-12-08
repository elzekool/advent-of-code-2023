const fs = require('node:fs');
const input = fs.readFileSync('input.txt', 'utf8').trim();

const cardsToPlay = {};
const cards = {};

input.split('\n').forEach((line) => {
    let [ card, numbers ] = line.split(':');
    card = Number.parseInt(card.replace(/^Card\s*/, ''), 10);
    const [ winning, drawn ] = numbers.split('|').map(n => n.trim().split(/\s+/));
    const matching = [ ...new Set(drawn) ].filter(c => winning.indexOf(c) !== -1)
    cards[card] = matching.map((_, idx) => card + idx + 1);
    cardsToPlay[card] = 1;
});

let score = 0;
Object.keys(cards).forEach(c => {
    const numCards = cardsToPlay[c];
    const card = cards[c];
    
    score += numCards;
    card.forEach(otherCard => {
        cardsToPlay[otherCard] += numCards;
    });
})

console.log(score)

