const fs = require('node:fs');
const input = fs.readFileSync('input.txt', 'utf8').trim().split('\n')

const cardTypes = [ 'A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2' ];
const handTypes = [
    [ 1, 'five-of-a-kind', [ 5 ] ],
    [ 2, 'four-of-a-kind', [ 4, 1 ] ],
    [ 3, 'full-house', [ 3, 2 ] ],
    [ 4, 'three-of-kind', [ 3, 1, 1 ] ],
    [ 5, 'two-pair', [ 2, 2, 1 ] ],
    [ 6, 'one-pair', [ 2, 1, 1, 1 ] ],
    [ 7, 'high-card', [ 1, 2, 3, 4, 5 ]],
    [ 8, 'random', [] ]
];

const handTypeMemory = {};

const getHandType = (hand) => {
    if (typeof handTypeMemory[hand] !== "undefined") {
        return handTypeMemory[hand];
    }

    const cards = hand.split('');
    const uniqueCardTypes = [ ...new Set(cards)];
    const uniqueCardTypesQtys = {};

    uniqueCardTypes.forEach(
        type => {
            uniqueCardTypesQtys[type] = cards.filter(_type => _type === type).length
        }
    )
    const uniqueCardTypesSorted = uniqueCardTypes
        .sort((a, b) => uniqueCardTypesQtys[b] - uniqueCardTypesQtys[a]);

    handTypeMemory[hand] = handTypes.find(handType => {
        const criteria = handType[2];
        if (uniqueCardTypesSorted.length < criteria.length) {
            return false;
        }

        for(let x = 0; x < criteria.length; x++) {
            if (uniqueCardTypesQtys[uniqueCardTypesSorted[x]] !== criteria[x]) {
                return false;
            }
        }
        return true;
    })

    return handTypeMemory[hand];
}

const hands = [];
const bidsByHand = {};

input.forEach(line => {
    const [ hand, bid ] = line.split(' ');
    bidsByHand[hand] = bid;
    hands.push(hand);
});

const rankedHands = hands.sort((a, b) => {
    const rankA = getHandType(a)[0];
    const rankB = getHandType(b)[0];
    if (rankA !== rankB) {
        return rankB - rankA;
    }

    const cardsA = a.split('');
    const cardsB = b.split('');
    for(let x = 0; x < cardsA.length; x++) {
        const cardRankA = cardTypes.indexOf(cardsA[x]);
        const cardRankB = cardTypes.indexOf(cardsB[x])
        if (cardRankA !== cardRankB) {
            return cardRankB - cardRankA;
        }
    }

    return 0;

})

console.log(rankedHands.reduce((acc, hand, index) => {
    return acc + bidsByHand[hand] * (index+1)
}, 0));