import {fetchInputData} from "./libraries.js";

import sync_fetch from "sync-fetch";

const year = 2024
const day = 1;

let file = "";

const isBrowser = () => typeof window !== `undefined`
const isNode = !isBrowser()

if (isNode) {
    file = fetchInputData(year, day);
} else {
    file = sync_fetch(`data/day_${day}.txt`).text();
}

///////////////////////////////////////////////////
// START HERE
///////////////////////////////////////////////////

let f = file.trim().split("\n").map(r => r.split(/\s+/))

let left = []
let right = []
for (const row of f) {
    left.push(parseInt(row[0]))
    right.push(parseInt(row[1]))
}

left.sort(function (a, b) {
    return a - b
});
right.sort(function (a, b) {
    return a - b
});

let part1 = 0
for (let i = 0; i < left.length; i++) {
    part1 += Math.abs(left[i] - right[i])
}
console.log(part1)

let part2 = 0
for (let i = 0; i < left.length; i++) {
    let n = 0
    for (let j = 0; j < right.length; j++) {
        if (right[j] == left[i])
            n++
    }
    part2 += n * left[i]
}
console.log(part2)