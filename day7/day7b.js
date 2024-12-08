const fs = require('node:fs');
const input = fs.readFileSync('input.txt', 'utf8').trim().split('\n')

const cardTypes = [ 'A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J' ];
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

    const cardsWithJokers = hand.split('');
    const numJokers = cardsWithJokers.filter(c => c === 'J').length;

    let cardsToCheck = [
        cardsWithJokers.filter(c => c !== 'J')
    ];

    // Expand cards to check... this is.. NOT optimized :D
    for(let x = 0; x < numJokers; x++) {
        let newCardsToCheck = [];
        for(let y = 0; y < cardsToCheck.length; y++) {
            cardTypes.forEach((r) => {
                newCardsToCheck.push([ ...cardsToCheck[y], r ])
            })
        }
        cardsToCheck = newCardsToCheck;
    }

    let bestHandType = handTypes[handTypes.length-1];
    cardsToCheck.forEach((cards) => {
        const uniqueCardTypes = [ ...new Set(cards)];
        const uniqueCardTypesQtys = {};

        uniqueCardTypes.forEach(
            type => {
                uniqueCardTypesQtys[type] = cards.filter(_type => _type === type).length
            }
        )
        const uniqueCardTypesSorted = uniqueCardTypes
            .sort((a, b) => uniqueCardTypesQtys[b] - uniqueCardTypesQtys[a]);

        const handType = handTypes.find(handType => {
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

        if (handType[0] < bestHandType[0]) {
            bestHandType = handType;
        }
    });
    
    return handTypeMemory[hand] = bestHandType;
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