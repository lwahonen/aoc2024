import {columns, fetchInputData, overlappedMatches} from "./libraries.js";

const year = 2024
const day = 2;

let file = "";

const isBrowser = () => typeof window !== `undefined`
const isNode = !isBrowser()

if (isNode) {
    file = fetchInputData(year, day);
} else {
    const sync_fetch = require('sync-fetch')
    file = sync_fetch(`data/day_${day}.txt`).text();
}

///////////////////////////////////////////////////
// START HERE
///////////////////////////////////////////////////

let part1 = 0
let part2 = 0
let input = file.trim().split("\n").map(b=> {
    let split = b.split(" ");
    return split.map(x => parseInt(x));
})

let safeLevels=[]

function isValid(row) {
    let increase = false;
    let decrease = false;
    for (let i = 1; i < row.length; i++) {
        let here = row[i - 1];
        let last = row[i];
        if (last > here)
            increase = true;
        if (last < here)
            decrease = true;
        let step = Math.abs(last - here);
        if (step < 1 || step > 3) {
            return false
        }
    }
    return !(increase && decrease);
}

for (let i = 0; i < input.length; i++) {
    let row = input[i]
    if (isValid(row)) {
        // Cache for part 2
        safeLevels.push(i)
        part1++
    }
}

for (let i = 0; i < input.length; i++) {
    if (safeLevels.includes(i)) {
        part2++
        continue
    }
    let row = input[i]
    for (let skip = 0; skip < row.length; skip++) {
        let ins = row.toSpliced(skip, 1)
        if (isValid(ins)) {
            // console.log("Row " + row + " is safe if skip element " + skip)
            part2++
            break
        }
    }
}

console.log("Part 1 " + part1)
console.log("Part 2 " + part2)