import {columns, fetchInputData, overlappedMatches} from "./libraries.js";

import crypto from "crypto";

const year = 2024
const day = 16;

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

let input = file.trim().split("\n").map(b => b.split(""))

function get(row, col) {
    if (row < 0 || row >= input.length) return "#"
    if (col < 0 || col >= input[0].length) return "#"
    return input[row][col]
}

function getDist(row, col, endRow, endCol) {
    return Math.abs(row - endRow) + Math.abs(col - endCol)
}

function getMove(row, col, dir, score) {
    switch (dir) {
        case "up":
            let nextUp = get(row - 1, col);
            if (nextUp == "#") {
                return [
                    {row: row, col: col, dir: "left", score: score + 1000, dist: getDist(row, col, end[0], end[1])},
                    {row: row, col: col, dir: "right", score: score + 1000, dist: getDist(row, col, end[0], end[1])}
                ];
            } else {
                return [
                    {row: row - 1, col: col, dir: dir, score: score + 1, dist: getDist(row - 1, col, end[0], end[1])},
                    {row: row, col: col, dir: "left", score: score + 1000, dist: getDist(row, col, end[0], end[1])},
                    {row: row, col: col, dir: "right", score: score + 1000, dist: getDist(row, col, end[0], end[1])}
                ];
            }
        case "down":
            let nextDown = get(row + 1, col);
            if (nextDown == "#") {
                return [
                    {row: row, col: col, dir: "right", score: score + 1000, dist: getDist(row, col, end[0], end[1])},
                    {row: row, col: col, dir: "left", score: score + 1000, dist: getDist(row, col, end[0], end[1])}
                ];
            } else {
                return [
                    {row: row + 1, col: col, dir: dir, score: score + 1, dist: getDist(row + 1, col, end[0], end[1])},
                    {row: row, col: col, dir: "right", score: score + 1000, dist: getDist(row, col, end[0], end[1])},
                    {row: row, col: col, dir: "left", score: score + 1000, dist: getDist(row, col, end[0], end[1])}
                ];
            }
        case "left":
            let nextLeft = get(row, col - 1);
            if (nextLeft == "#") {
                return [
                    {row: row, col: col, dir: "down", score: score + 1000, dist: getDist(row, col, end[0], end[1])},
                    {row: row, col: col, dir: "up", score: score + 1000, dist: getDist(row, col, end[0], end[1])}
                ];
            } else {
                return [
                    {row: row, col: col - 1, dir: dir, score: score + 1, dist: getDist(row, col - 1, end[0], end[1])},
                    {row: row, col: col, dir: "up", score: score + 1000, dist: getDist(row, col, end[0], end[1])},
                    {row: row, col: col, dir: "down", score: score + 1000, dist: getDist(row, col, end[0], end[1])}
                ];
            }
        case "right":
            let nextRight = get(row, col + 1);
            if (nextRight == "#") {
                return [
                    {row: row, col: col, dir: "up", score: score + 1000, dist: getDist(row, col, end[0], end[1])},
                    {row: row, col: col, dir: "down", score: score + 1000, dist: getDist(row, col, end[0], end[1])}
                ];
            } else {
                return [
                    {row: row, col: col + 1, dir: dir, score: score + 1, dist: getDist(row, col + 1, end[0], end[1])},
                    {row: row, col: col, dir: "down", score: score + 1000, dist: getDist(row, col, end[0], end[1])},
                    {row: row, col: col, dir: "up", score: score + 1000, dist: getDist(row, col, end[0], end[1])}
                ];
            }
    }
}


function findStart(targetMap) {
    for (let row = 0; row < targetMap.length; row++) {
        for (let col = 0; col < targetMap[0].length; col++) {
            if (targetMap[row][col] === "S") {
                targetMap[row][col] = "."
                return [row, col]
            }
        }
    }
}

function findEnd(targetMap) {
    for (let row = 0; row < targetMap.length; row++) {
        for (let col = 0; col < targetMap[0].length; col++) {
            if (targetMap[row][col] === "E") {
                return [row, col]
            }
        }
    }
}

let start = findStart(input)
let end = findEnd(input)
let visited = {}
let bestPaths = []
let bestScore = 106512
let parents = {}

let moves = [[{row: start[0], col: start[1], dir: "right", score: 0}, `${start[0]},${start[1]},right`]]
while (moves.length > 0) {
    let step = moves.pop()
    let here = step[0]
    if (input[here.row][here.col] == "E") {
        if (here.score < bestScore) {
            bestScore = here.score
            bestPaths = []
        }
        if (here.score > bestScore) {
            continue
        }
        console.log("Part 1 " + here.score)
        bestPaths.push(step[1])
        break
    }
    let key = `${here.row},${here.col},${here.dir}`
    let path = step[1] + "-" + key
    // First time?
    if (visited[key] == undefined) {
        visited[key] = here.score
        parents[key] = [path]
    } else {
        // This path is worse than the one we had
        if (visited[key] < here.score) {
            continue
        }
        // Another path with the same score
        if (visited[key] == here.score) {
            parents[key].push(path)
            continue
        }
        // New path
        if (visited[key] > here.score) {
            parents[key] = [path]
            visited[key] = here.score
        }
    }
    let nextMoves = getMove(here.row, here.col, here.dir, here.score)
    for (let i = 0; i < nextMoves.length; i++) {
        let nextMove = nextMoves[i];
        moves.push([nextMove, path])
    }
    moves.sort((b, a) => {
        return a[0].score - b[0].score
    })
}

let part2 = 0
let tiles = {}

for (let i = 0; i < bestPaths.length; i++) {
    let path = bestPaths[i]
    path = path.split("-")
    for (let j = 0; j < path.length; j++) {
        let parent = parents[path[j]];
        for (const parentElement of parent) {
            let parentage = parentElement.split("-")
            for (let k = 0; k < parentage.length; k++) {
                let [row, col, dir] = parentage[k].split(",").map(b => parseInt(b))
                tiles[`${row},${col}`] = true
            }
        }
    }
}
part2 += Object.keys(tiles).length + 1
console.log("Part 2 " + part2)