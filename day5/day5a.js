const fs = require('node:fs');
const input = fs.readFileSync('input.txt', 'utf8')
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

const locations = [];

input[0][0].replace('seeds: ', '').split(' ').map(n => Number.parseInt(n.trim(), 10)).forEach(
    (id) => {
        steps.forEach(step => {
            id = conv(step, id);
        });
        locations.push(id);
    }
)

console.log(Math.min.apply(null, locations));