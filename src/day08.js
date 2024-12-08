import {fetchInputData} from "./libraries.js";

const year = 2024
const day = 8;

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

let input = file.trim().split("\n").map(b => b.split(""))

let nodes = {}

let part1={}
let part2={}
for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input.length; col++) {
        if (input[row][col] != ".") {
            let key = row + "," + col
            nodes[key] = {
                row: row, col: col, value: input[row][col]
            }
        }
    }
}

function antinode(ans, row, col) {
    if (row < 0)
        return false
    if (col < 0)
        return false
    if (row >= input.length)
        return false
    if (col >= input.length)
        return false
    ans[row + "," + col] = true
    return true
}

for (const nkey in nodes) {
    let n1 = nodes[nkey]
    for (const n2k in nodes) {
        let n2 = nodes[n2k]
        if (n2.row == n1.row && n2.col == n1.col)
            continue
        if (n2.value != n1.value)
            continue
        let rdist = (n2.row - n1.row)
        let cdist = (n2.col - n1.col)
        // console.log("Found n1 pair " + JSON.stringify(n1) + " " + JSON.stringify(n2)+" "+rdist+" "+cdist)

        antinode(part1, n1.row - rdist, n1.col - cdist)
        antinode(part1, n2.row + rdist, n2.col + cdist)

        // This is excessive but we're not going to worry about it
        for (let i = 0; i < input.length; i++) {
            let inside1 = antinode(part2, n1.row - rdist * i, n1.col - cdist * i)
            let inside2 = antinode(part2, n1.row + rdist * i, n1.col + cdist * i)

            if (!inside1 && !inside2)
                break
        }
    }
}

console.log("Part 1 " + Object.keys(part1).length)
console.log("Part 2 " + Object.keys(part2).length)
