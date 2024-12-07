import {fetchInputData} from "./libraries.js";

const year = 2024
const day = 7;

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
//

function parseEq(b) {
    let s = b.split(":")
    let list = s[1].trim().split(" ").map(v => parseInt(v))
    return {target: parseInt(s[0]), values: list}
}

function possibleSums(list) {
    if (list.length == 1)
        return [list[0]]
    let current = list.pop()
    let recurse = possibleSums(list);
    let ret = []
    for (let value of recurse) {
        ret.push(current + value);
        ret.push(current * value);
    }
    return ret
}

function possibleSums2(list) {
    if (list.length == 1)
        return [list[0]]
    let current = list.pop()
    let recurse = possibleSums2(list);
    let ret = []
    for (let value of recurse) {
        ret.push(current + value);
        ret.push(current * value);
        ret.push(parseInt(`${value}${current}`));
    }
    return ret
}

let cards = file.trim().split("\n").map(b => parseEq(b))

let part1 = 0
let part2 = 0

for (const card of cards) {
    let options = possibleSums(structuredClone(card.values))
    if (options.includes(card.target)) {
        part1 += card.target
    }
    options = possibleSums2(structuredClone(card.values))
    if (options.includes(card.target)) {
        part2 += card.target
    }
}

console.log(part1)
console.log(part2)
