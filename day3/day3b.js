const fs = require('node:fs');
const input = fs.readFileSync('input.txt', 'utf8').trim();

const regex = /([^0-9])([0-9]+)([^0-9])/;
const lines = input.split('\n').map(line => '.' + line.trim() + '.');

let gears = {};

const addGearNumber = (x, y, number) => {
    const k = `${y+1},${x}`;
    if (typeof gears[k] === "undefined") {
        gears[k] = [];
    }
    gears[k].push(Number.parseInt(number, 10));
}

lines.forEach((line, lineIdx) => {

    let offset = 0;
    let search = line;
    while ((found = regex.exec(search)) !== null) {
        const startIdx = found.index + found[1].length;
        const endIdx = startIdx + found[2].length;

        search = search.substring(endIdx);

        if (found[1] === '*') {
            const x = offset + startIdx - 1;
            const y = lineIdx;
            addGearNumber(x, y, found[2]);
        }

        if (found[3] === '*') {
            const x = offset + endIdx;
            const y = lineIdx;
            addGearNumber(x, y, found[2]);
        }

        if (lineIdx > 0) {
            lines[lineIdx-1].substring(offset + startIdx-1, offset + endIdx+1).split('').forEach((char, off) => {
                if (char === '*') {
                    const x = offset + startIdx - 1 + off;
                    const y = lineIdx-1;
                    addGearNumber(x, y, found[2]);
                }
            }) 
        }

        if (lineIdx < lines.length-1) {
            lines[lineIdx+1].substring(offset + startIdx-1, offset + endIdx+1).split('').forEach((char, off) => {
                if (char === '*') {
                    const x = offset + startIdx - 1 + off;
                    const y = lineIdx+1;
                    addGearNumber(x, y, found[2]);
                }
            }) 
        }

        offset += endIdx;
    }
});

console.log(
    Object.values(gears)
        .filter((gear => gear.length === 2))
        .map(gear => gear.reduce((acc, val) => acc * val, 1))
        .reduce((acc, val) => acc + val)
);