import {columns, fetchInputData, overlappedMatches} from "./libraries.js";

import crypto from "crypto";

const year = 2024
const day = 15;

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


let ss = file.trim().split("\n\n")
let map1 = ss[0].trim().split("\n").map(b => b.split(""))
let turns = ss[1].trim().split("")

let map2 = []
for (let row = 0; row < map1.length; row++) {
    map2[row] = []
    for (let col = 0; col < map1[0].length; col++) {
        let current = map1[row][col];
        if (current === "O") {
            map2[row].push("[")
            map2[row].push("]")
        }
        if (current === "#") {
            map2[row].push("#")
            map2[row].push("#")
        }
        if (current === ".") {
            map2[row].push(".")
            map2[row].push(".")
        }
        if (current === "@") {
            map2[row].push("@")
            map2[row].push(".")
        }
    }
}

function get(row, col, map) {
    if (row < 0 || row >= map.length || col < 0 || col >= map[0].length) {
        return "#"
    }
    return map[row][col]
}


function findStart(targetMap) {
    for (let row = 0; row < targetMap.length; row++) {
        for (let col = 0; col < targetMap[0].length; col++) {
            if (targetMap[row][col] === "@") {
                targetMap[row][col] = "."
                return [row, col]
            }
        }
    }
}


function push(map, row, col, dir) {
    let movers = []
    let check = [[row, col]]
    while (check.length > 0) {
        let current = check.pop()
        let currentLetter = get(current[0], current[1], map);
        if (currentLetter === "#") {
            return false
        }
        if (currentLetter === "O") {
            movers.push([current[0], current[1]])
            check.push([current[0] + dir[0], current[1] + dir[1]])
        }
        if (currentLetter === "[") {
            movers.push([current[0], current[1]])

            if (dir[0] === 0 && dir[1] === 1) {
                check.push([current[0], current[1] + 2])
                movers.push([current[0], current[1] + 1])
            }

            if (dir[0] === 0 && dir[1] === -1) {
                console.log("Why are you pulling on the edge")
            }

            if (dir[0] != 0 && dir[1] === 0) {
                check.push([current[0] + dir[0], current[1] + 1])
                check.push([current[0] + dir[0], current[1]])
                movers.push([current[0], current[1] + 1])
            }
        }
        if (currentLetter === "]") {
            movers.push([current[0], current[1]])

            if (dir[0] === 0 && dir[1] === -1) {
                check.push([current[0], current[1] - 2])
                movers.push([current[0], current[1] - 1])
            }

            if (dir[0] === 0 && dir[1] === 1) {
                console.log("Why are you pulling on the edge")
            }

            if (dir[0] != 0 && dir[1] === 0) {
                check.push([current[0] + dir[0], current[1] - 1])
                check.push([current[0] + dir[0], current[1]])
                movers.push([current[0], current[1] - 1])
            }
        }
    }
    let tempMap = JSON.parse(JSON.stringify(map))
    for (let i = 0; i < movers.length; i++) {
        let old = movers[i]
        let oldRow = old[0];
        let oldCol = old[1];
        map[oldRow][oldCol] = "."
    }
    for (let i = 0; i < movers.length; i++) {
        let old = movers[i]
        let oldRow = old[0];
        let newRow = oldRow + dir[0];
        let oldCol = old[1];
        let newCol = oldCol + dir[1];
        let oldChar = tempMap[oldRow][oldCol];
        map[newRow][newCol] = oldChar
    }
    return true
}

for (const map of [map1, map2]) {
    let here = findStart(map)
    for (let i = 0; i < turns.length; i++) {
        let dir = turns[i]
        let newRow = here[0]
        let newCol = here[1]
        if (dir == "^") {
            newRow--
        }
        if (dir == ">") {
            newCol++
        }
        if (dir == "<") {
            newCol--
        }
        if (dir == "v") {
            newRow++
        }
        let current = get(newRow, newCol, map);
        if (current == "#") {
            continue
        }
        if (current == "O" || current == "[" || current == "]") {
            let rmod = newRow - here[0];
            let cmod = newCol - here[1];
            if (!push(map, newRow, newCol, [rmod, cmod])) {
                continue
            }
            here = [newRow, newCol]
        }
        here = [newRow, newCol]
    }
}

let part1 = 0
let part2 = 0

for (let row = 0; row < map1.length; row++) {
    for (let col = 0; col < map1[0].length; col++) {
        if (map1[row][col] === "O") {
            part1 += row * 100 + col
        }
    }
}
for (let row = 0; row < map2.length; row++) {
    for (let col = 0; col < map2[0].length; col++) {
        if (map2[row][col] === "[") {
            part2 += row * 100 + col
        }
    }
}
console.log("Part 1 is " + part1)
console.log("Part 2 is " + part2)
