import {fetchInputData, overlappedMatches} from "./libraries.js";
import {regex} from 'regex';

const year = 2024
const day = 3;

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

function countString(into) {
    let part1 = 0
    let b = overlappedMatches(into, /mul\((\d+),(\d+)\)/)
    for (const bElement of b) {
        let first = parseInt(bElement[1]);
        let second = parseInt(bElement[2]);
        part1 += first * second
    }
    return part1;
}

console.log("Part 1 " + countString(file))

let part2 = 0;

let subs=file.split(/don't\(\)/)
// Count until don't activated
part2+=countString(subs[0])
for (let i = 1; i < subs.length; i++) {
    let sub = subs[i];
    // Find the part where do is turned on again
    let end = /do\(\)/.exec(sub)
    if (end) {
        sub = sub.substring(end.index, sub.length)
        part2 += countString(sub);
    }
}
console.log("Unga bunga part 2 " + part2)

let dis=file.replaceAll("\n", " ").replaceAll(/don't\(\).*?(do\(\)|$)/g, " ")
let test         = countString(dis);
console.log("Replaceall part 2 " + test)
