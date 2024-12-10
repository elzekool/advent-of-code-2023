const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();

const START = 'S';

const NORTH = [  0, -1 ];
const SOUTH = [  0,  1 ];
const EAST  = [  1,  0 ];
const WEST  = [ -1,  0 ];

const tileTypes = {
    '|' : [ NORTH, SOUTH ],
    '-' : [ EAST, WEST ],
    'L' : [ NORTH, EAST ],
    'J' : [ NORTH, WEST ],
    '7' : [ SOUTH, WEST ],
    'F' : [ SOUTH, EAST ],
    'S' : [ NORTH, SOUTH, EAST, WEST ],
    '.' : [],
    'I' : [],
    'O' : [],
}

const matrix = input.split('\n').map((row) => row.split(''));
const width = matrix[0].length;
const height = matrix.length;

const inBound = (x, y) => x >= 0 && y >= 0 && x < width && y < height;

const getField = (x, y) => matrix[y][x];
const setField = (x, y, s) => matrix[y][x] = s;

const coordToId = (x, y) => y * width + x;
const idToCoord = (i) => [ i % width, Math.floor(i / width) ]

const connections = {};


const calcConnections = (x, y, type) => {
    if (typeof type === "undefined") {
        return [];
    }    

    const conn = [];
    type.forEach(([ offX, offY ]) => {
        const destX = x + offX;
        const destY = y + offY;
        if (!inBound(destX, destY)) {
            return;
        }
        conn.push([ destX, destY ]);
    });
    return conn;
}

for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
        connections[coordToId(x, y)] = [];
    }
}

let startingPoint;
for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
        if (typeof tileTypes[getField(x, y)] === "undefined") {
            continue;
        }

        if (getField(x, y) === 'S') {
            startingPoint = coordToId(x, y);
        }
        const connKey = coordToId(x, y);
        calcConnections(x, y, tileTypes[getField(x, y)]).forEach((conn) => {
            // Only add when there is a connection back
            if (calcConnections(conn[0], conn[1], tileTypes[getField(conn[0], conn[1])]).filter(_conn => (
                _conn[0] === x && _conn[1] === y
            )).length === 0) {
                return;
            }
            connections[connKey].push(coordToId(conn[0], conn[1]));
        })
    }
}

const paths = [];
connections[startingPoint].forEach((point) => {
    paths.push([ startingPoint, point])
});

while(true) {
    paths.forEach((path, idx) => {
        const lastItem = path[path.length-1];
        if (lastItem === null) {
            return;
        }
        const nextOptions = connections[lastItem].filter((c => path.indexOf(c) === -1));
        if (nextOptions.length === 0) {
            path.push(null);
            return;
        }
        path.push(nextOptions[0]);
    });

    // Inefficent way to find a connection
    const all = paths
        .reduce((acc, val) => [ ...acc, ...val.filter(v => (
            v !== null && v !== startingPoint
        ))], []);
    const unique = [ ...new Set(all)];

    if (all.length !== unique.length) {
        break;
    }
}

// First determine what the start point would be 
const connectedToStart = paths.reduce((acc, val) => [...acc, val[1]], []);
Object.keys(tileTypes).forEach((typeKey) => {
    if (typeKey === START) {
        return;
    }
    const type = tileTypes[typeKey];
    const startCoord = idToCoord(startingPoint);
    const check = calcConnections(startCoord[0], startCoord[1], type).map(c => coordToId(c[0], c[1]));
    if (check.filter(c => connectedToStart.indexOf(c) !== -1).length === connectedToStart.length) {
        setField(startCoord[0], startCoord[1], typeKey);
    }
})

// Make one single path
const pathPoints = [
    ...paths[0],
    // We reverse the second path as that search from the other
    ...paths[1].reverse().slice(0, -1),
];

console.log("Route found, now matching");

const matched = [];

const directions = [
    [ 0,  1, '-', 'FJ', '7L' ],
    [ 0, -1, '-', 'JF', 'L7' ],
    [ 1,  0, '|', 'FJ', 'L7' ],
    [ -1, 0, '|', 'JF', '7L' ]
];
const directionsLength = directions.length;

// Search grid, skip the first and last item in row/column as that
// never can be inside the path
for (let x = 1; x < width - 1; x++) {
    for (let y = 1; y < height -1; y++) {
        if (pathPoints.includes(coordToId(x,y))) {
            continue;
        }
    
        let matchedDirs = true;

        for (let j = 0; j < directionsLength; j++) {
            const [ dirX, dirY, straightChar, pairChar1, pairChar2 ] = directions[j];

            let posX = x + dirX;
            let posY = y + dirY;

            let cnt = 0;

            let cornerChars = '..';

            while(inBound(posX, posY)) {
                if (!pathPoints.includes(coordToId(posX, posY))) {
                    posX += dirX;
                    posY += dirY;
                    continue;
                }

                const c = getField(posX, posY);
                if (c === 'F' || c === 'J' || c === 'L' || c == '7') {
                    cornerChars = cornerChars.substring(1) + c;
                }

                // Here the magic happens
                //
                // We are testing to see if an element is inside or out
                // by checking if the number of crossed lines in all direction
                // is odd. 
                // 
                // However due to the rule that the animal can squize through
                // cracks we have special rules surrounding corners. 
                //
                // They only are seen as a line when the entry and exit directions
                // are inverse.
                //
                // Examples:
                //
                // X, direction up: First └ and then ┐ those are in different 
                //                  exit directions, so this counts as a line crossing
                // 
                // Y, direction up: First ┘ and then ┐ those are in the same 
                //                  exit directions, so this doesnt counts 
                //
                //  ┌──────┐ 
                //  │┌────┐│ 
                //  ││OOOO│└┐
                //  ││OOOO│X│
                //  │└─┐┌─┘┌┘
                //  │II││IY│ 
                //  └──┘└──┘ 
                //          
                if (c === straightChar) {
                    cnt++;

                } else if (cornerChars === pairChar1) {
                    cnt++
                    cornerChars = '..';
        
                } else if (cornerChars === pairChar2) {
                    cnt++; 
                    cornerChars = '..';
                }

                posX += dirX;
                posY += dirY;
            }

            if (cnt % 2 === 0) {
                matchedDirs = false;
                break;
            }
        }

        if (matchedDirs) {
            matched.push(coordToId(x, y));
        }
    }
}

const printMatrix = () => {
    matrix.forEach((line, y) => {
        console.log(line.map((i, x) => {
            const coord = coordToId(x, y);

            const conv = {
                'F' : '┌',
                'L' : '└',
                '7' : '┐',
                'J' : '┘',
                '|' : '│',
                '-' : '─',
                '.' : ' '
            };

            const j = conv[i] ?? i;
            if (matched.filter((p) => p === coord).length > 0) {
                return `\x1b[48;5;166m${j}\x1b[0m`;
            } else if (pathPoints.filter((p) => p === coord).length > 0) {
                return `\x1b[48;5;59m${j}\x1b[0m`;
            } else {
                return `\x1b[2m${j}\x1b[22m`;
            }
        }).join(''))
    })
}

// printMatrix();
console.log(matched.length);