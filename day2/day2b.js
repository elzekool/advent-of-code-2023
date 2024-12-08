const fs = require('node:fs');
const input = fs.readFileSync('input.txt', 'utf8').trim();

let possible = 0;

input.split("\n").forEach((line) => {
    let [ game, sets ] = line.split(':').map(s => s.trim());
    game = Number.parseInt(game.replace('Game ', ''), 10);

    sets = sets.split(';').map(s => s.trim()).map((set) => {
        let res = {};
        set.split(',').map(s => s.trim()).forEach(reveal => {
            const [ number, color ] = reveal.split(' ');
            res[color] = Number.parseInt(number, 10);
        });
        return res;
    })

    let green = 0;
    let red = 0;
    let blue = 0;

    sets.forEach(set => {
        green = Math.max(green, set.green ?? 0);
        red = Math.max(red, set.red ?? 0);
        blue = Math.max(blue, set.blue ?? 0);
    })

    possible += green * red * blue;
});

console.log(possible);