import {columns, fetchInputData, overlappedMatches} from "./libraries.js";

import crypto from "crypto";

const year = 2024
const day = 19;

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

let towels = file.trim().split("\n\n")[0].split(", ")
let designs = file.trim().split("\n\n")[1].split("\n")

console.log()

let cache = {}

function possible(design) {
    if (design.length == 0)
        return true
    if (cache[design] !== undefined)
        return cache[design]
    let options = 0
    for (let towel of towels) {
        if (design.endsWith(towel)) {
            options += possible(design.slice(0, design.length - towel.length))
        }
    }
    cache[design] = options
    return options
}

let part1 = 0
let part2 = 0
for (let design of designs) {
    let options = possible(design);
    if (options > 0)
        part1++
    part2 += options
}

console.log("Part 1 " + part1)
console.log("Part 2 " + part2)