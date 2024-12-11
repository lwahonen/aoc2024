import {columns, fetchInputData, overlappedMatches} from "./libraries.js";

const year = 2024
const day = 11;

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

let input=file.trim().split(" ").map(b=>parseInt(b))

let part1=0
let part2=0

let stones={}
for (let i = 0; i < input.length; i++) {
    if (stones[input[i]] == undefined)
        stones[input[i]] = 0
    stones[input[i]] += 1
}


for (let round = 0; round < 75; round++) {
    let newStones = {}
    for (const stone in stones) {
        let count = stones[stone]
        if (stone == 0) {
            newStones[1] = count
            continue
        }
        let str = stone.toString()
        if (str.length % 2 == 0) {
            let f = parseInt(str.substr(0, str.length / 2))
            let g = parseInt(str.substr(str.length / 2, str.length / 2))
            if (newStones[f] == undefined)
                newStones[f] = 0
            if (newStones[g] == undefined)
                newStones[g] = 0
            newStones[f] += count
            newStones[g] += count
            continue
        }

        let number = stone * 2024;
        if (newStones[number] == undefined)
            newStones[number] = 0
        newStones[number] += count
    }
    stones = newStones
    if (round == 24) {
        for (const stone in stones) {
            part1 += stones[stone]
        }
    }
}

for (const stone in stones) {
    part2 += stones[stone]
}

console.log("Part 1 "+part1)
console.log("Part 2 "+part2)
