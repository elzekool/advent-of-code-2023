const fs = require('node:fs');
const input = fs.readFileSync('input.txt', 'utf8').trim();

const written = [ null, 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine' ];
const number = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]

console.log(input.split('\n').reduce((acc, val) => {
    let firstIndex = val.length;
    let firstFind = null;

    let lastIndex = -1;
    let lastFind = null;

    const searchFn = (find, index) => {
        if (find === null) {
            return;
        }

        const nIndexOf = val.indexOf(find);
        const nLastIndexOf = val.lastIndexOf(find);
        if (nIndexOf !== -1 && nIndexOf < firstIndex) {
            firstIndex = nIndexOf;
            firstFind = `${index}`;
        }
        if (nLastIndexOf !== -1 && nLastIndexOf > lastIndex) {
            lastIndex = nLastIndexOf;
            lastFind = `${index}`;
        }
    }; 

    written.forEach(searchFn);
    number.map(n => `${n}`).forEach(searchFn);

    return acc + Number.parseInt(firstFind + lastFind);
}, 0));