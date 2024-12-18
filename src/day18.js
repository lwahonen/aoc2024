import {fetchInputData} from "./libraries.js";

const year = 2024
const day = 18;

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
let input = file.trim().split("\n").map(b => b.split(",").map(c => parseInt(c)))

let maxX = 70
let maxY = 70

function get(x, y, bytes) {
    if (x < 0 || x > maxX || y < 0 || y > maxY) {
        return "#"
    }
    for (let i = 0; i < bytes.length; i++) {
        if (bytes[i][0] === x && bytes[i][1] === y) {
            return "#"
        }
    }
    return "."
}

function solvable(bytes) {
    let moves = [{x: 0, y: 0, steps: 0}]
    let seen = {}
    while (moves.length > 0) {
        let {x, y, steps} = moves.pop()
        if (get(x, y, bytes) === "#") {
            continue
        }
        if (x == maxX && y == maxY) {
            return steps
        }
        let key = `${x},${y}`
        if (seen[key]) {
            continue
        }
        seen[key] = true
        moves.push({x: x + 1, y, steps: steps + 1})
        moves.push({x: x - 1, y, steps: steps + 1})
        moves.push({x, y: y + 1, steps: steps + 1})
        moves.push({x, y: y - 1, steps: steps + 1})
        moves.sort((b, a) => a.steps - b.steps)
    }
    return -1
}

console.log("Part 1 " + solvable(input.slice(0, 1024)))
for (let i = input.length - 1; i > 1024; i--) {
    if (solvable(input.slice(0, i)) > 0) {
        console.log("Maze becomes solvable after removing byte number " + (i) + " at " + input[i])
        break
    }
}