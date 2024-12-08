const fs = require('node:fs');
const input = fs.readFileSync('input.txt', 'utf8').trim();

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
    '.' : []
}

const matrix = input.split('\n').map((row) => row.split(''));
const width = matrix[0].length;
const height = matrix.length;

const inBound = (x, y) => x >= 0 && y >= 0 && x < width && y < height;
const getField = (x, y) => matrix[y][x];

const connections = {};

const getConnectionKey = (x, y) => `${x},${y}`;

const calcConnections = (x, y) => {
    const conn = [];
    tileTypes[getField(x, y)].forEach(([ offX, offY ]) => {
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
        connections[getConnectionKey(x, y)] = [];
    }
}

let startingPoint;

for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
        if (getField(x, y) === 'S') {
            startingPoint = getConnectionKey(x, y);
        }
        const connKey = getConnectionKey(x, y);
        calcConnections(x, y).forEach((conn) => {
            // Only add when there is a connection back
            if (calcConnections(conn[0], conn[1]).filter(_conn => (
                _conn[0] === x && _conn[1] === y
            )).length === 0) {
                return;
            }
            connections[connKey].push(getConnectionKey(conn[0], conn[1]));
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
        if (nextOptions.length > 1) {
            console.log('ow no!');
        }
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

console.log(paths.map(p => p.length));
