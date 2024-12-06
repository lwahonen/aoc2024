import {fetchInputData} from "./libraries.js";

const year = 2024
const day = 6;

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

let input=file.trim().split("\n").map(b=>b.split(""))

let newStart = null
for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[row].length; col++) {
        if (input[row][col] == "^") {
            input[row][col] = "."
            newStart = {row: row, col: col, dir: [-1, 0]}
            break
        }
    }
}

function turnRight(dir) {
    if (dir[0] == -1)
        return [0, 1]
    if (dir[1] == 1)
        return [1, 0]
    if (dir[0] == 1)
        return [0, -1]
    if (dir[1] == -1)
        return [-1, 0]
}

let blockedRow=-1
let blockedColumn=-1

function getNextPos(where) {
    let nextRow = where.row + where.dir[0]
    let nextCol = where.col + where.dir[1]
    if (nextRow < 0)
        return null
    if (nextRow > input.length - 1)
        return null
    if (nextCol < 0)
        return null
    if (nextCol > input[0].length - 1)
        return null
    if (nextRow == blockedRow && nextCol == blockedColumn)
        return {row: where.row, col: where.col, dir: turnRight(where.dir)}
    if (input[nextRow][nextCol] == ".")
        return {row: nextRow, col: nextCol, dir: [...where.dir]}
    if (input[nextRow][nextCol] == "#")
        return {row: where.row, col: where.col, dir: turnRight(where.dir)}
}

let visited={}
let here=JSON.parse(JSON.stringify(newStart))
while (true) {
    visited[`${here.row},${here.col}`]=true
    let nextStep = getNextPos(here)
    if (nextStep == null)
        break
    here = nextStep
}

function halts()
{
    let visited={}
    while (true) {
        let haveSeen = `${here.row},${here.col},${here.dir.toString()}`;
        if (visited.hasOwnProperty(haveSeen))
            return true
        visited[haveSeen] = true
        let nextStep = getNextPos(here)
        if (nextStep == null)
            return false
        here = nextStep
    }
}

let score2 = 0

for (let r = 0; r < input.length; r++) {
    console.log("Row "+r)
    for (let c = 0; c < input[r].length; c++) {
        if(input[r][c] == "#")
            continue
        here=JSON.parse(JSON.stringify(newStart))
        blockedRow = r
        blockedColumn = c
        if (halts())
            score2++
    }
}

console.log("Part 1 " + Object.keys(visited).length)
console.log("Part 2 " + score2)
