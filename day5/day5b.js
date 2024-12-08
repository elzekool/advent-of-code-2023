const fs = require('node:fs');
const input = fs.readFileSync('test_input.txt', 'utf8')
    .trim()
    .split('\n\n')
    .map(s => s.trim().split('\n'));

const maps = {};
input.forEach((i) => {
    const m = /^([a-z\-]+) map\:$/.exec(i[0]);
    if (m === null) {
        return;
    }
    const k = m[1];
    i.shift();

    maps[k] = [];
    i.forEach(mapping => {
        const [ dest, source, range ] = mapping.split(' ').map(n => Number.parseInt(n.trim(), 10));
        maps[k].push({ min: source, max: source + range, diff: dest - source });
    });
    maps[k].sort((a, b) => a.min - b.min);
})

const conv = (type, id) => {
    const mapping = maps[type].find((i) => {
        return id >= i.min  && id < i.max;
    });
    return typeof mapping !== "undefined" ? id + mapping.diff : id;
}

const steps = [
    'seed-to-soil',
    'soil-to-fertilizer',
    'fertilizer-to-water',
    'water-to-light',
    'light-to-temperature',
    'temperature-to-humidity',
    'humidity-to-location'
];

let location = Number.POSITIVE_INFINITY;

const seedInput = input[0][0].replace('seeds: ', '').split(' ').map(n => Number.parseInt(n.trim(), 10));

console.time("solve");
for (let x = 0; x < seedInput.length; x+=2) {
    const startId = seedInput[x];
    const range = seedInput[x+1];

    console.log(startId, range);

    for(let y = 0; y < range; y++) {
        let id = startId + y;
        steps.forEach(step => {
            id = conv(step, id);
        });
        if (id < location) {
            location = id;
        }
    }

    console.timeLog("solve")
    console.log(location);
}
console.timeEnd("solve");

console.log(location);