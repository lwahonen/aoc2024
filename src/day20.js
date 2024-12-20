import {fetchInputData, filterObject} from "./libraries.js";

const year = 2024
const day = 20;

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

let racetrack = file.trim().split("\n").map(b => b.split(""))

function findChar(targetMap, c) {
    for (let row = 0; row < targetMap.length; row++) {
        for (let col = 0; col < targetMap[0].length; col++) {
            if (targetMap[row][col] === c) {
                return {x: col, y: row}
            }
        }
    }
}

function get(x, y) {
    if (x < 0 || x >= racetrack.length || y < 0 || y >= racetrack[0].length) {
        return "#"
    }
    let c = racetrack[y][x]
    if (c == "E" || c == "S") {
        return "."
    }
    return c
}

function floodFill(start, distances) {
    let moves = [{x: start.x, y: start.y, steps: 0}]
    while (moves.length > 0) {
        let {x, y, steps} = moves.pop()
        let key = `${x},${y}`
        if (distances[key] != undefined) {
            continue
        }
        distances[key] = steps
        if (get(x, y - 1) == ".") {
            moves.push({x: x, y: y - 1, steps: steps + 1})
        }
        if (get(x, y + 1) == ".") {
            moves.push({x: x, y: y + 1, steps: steps + 1})
        }
        if (get(x - 1, y) == ".") {
            moves.push({x: x - 1, y: y, steps: steps + 1})
        }
        if (get(x + 1, y) == ".") {
            moves.push({x: x + 1, y: y, steps: steps + 1})
        }
        moves.sort((b, a) => a.steps - b.steps)
    }
}

let start = findChar(racetrack, 'S')
let end = findChar(racetrack, 'E')

let startDistances = {}
let endDistances = {}
floodFill(start, startDistances)
floodFill(end, endDistances)

let noCheatDistance = startDistances[`${end.x},${end.y}`];

function findCheats(maxCheat) {
    let ret = 0
    for (let row = 1; row < racetrack.length - 1; row++) {
        for (let col = 1; col < racetrack.length - 1; col++) {
            if (get(col, row) === ".") {
                let here = startDistances[`${col},${row}`]
                for (let rdist = -maxCheat - 2; rdist <= maxCheat + 2; rdist++) {
                    for (let cdist = -maxCheat - 2; cdist <= maxCheat + 2; cdist++) {
                        if (Math.abs(rdist) + Math.abs(cdist) > maxCheat) {
                            continue
                        }
                        if (get(col + cdist, row + rdist) === ".") {
                            let endDistance = endDistances[`${col + cdist},${row + rdist}`];
                            let there = Math.abs(rdist) + Math.abs(cdist)
                            let result = here + there + endDistance
                            let gains = noCheatDistance - result
                            if (gains >= 100) {
                                ret++
                            }
                        }
                    }
                }
            }
        }
    }
    return ret
}

let part1 = findCheats(2);
console.log("Part 1 " + part1)

let part2 = findCheats(20);
console.log("Part 2 " + part2)

