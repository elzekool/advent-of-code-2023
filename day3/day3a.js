const fs = require('node:fs');
const input = fs.readFileSync('input.txt', 'utf8').trim();

const regex = /([^0-9])([0-9]+)([^0-9])/;
const lines = input.split('\n').map(line => '.' + line.trim() + '.');

let sum = 0;

lines.forEach((line, lineIdx) => {

    let offset = 0;
    let search = line;
    while ((found = regex.exec(search)) !== null) {
        const startIdx = found.index + found[1].length;
        const endIdx = startIdx + found[2].length;

        search = search.substring(endIdx);

        let check = '';
        check += found[1];
        check += found[3];

        if (lineIdx > 0) {
            check += lines[lineIdx-1].substring(offset + startIdx-1, offset + endIdx+1)
        }

        if (lineIdx < lines.length-1) {
            check += lines[lineIdx+1].substring(offset + startIdx-1, offset + endIdx+1)
        }

        offset += endIdx;

        if (/[^0-9\.]/.test(check)) {
            sum += Number.parseInt(found[2], 10);
        }
    }
});

console.log(sum);