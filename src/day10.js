import {fetchInputData} from "./libraries.js";

const year = 2024
const day = 10;

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

let d = file.trim().split("\n").map(b => b.split("").map(c => parseInt(c)))

function nextStep(row, col) {
    let here = d[row][col]
    if (here == 9)
        return []
    let ret = []
    if (row > 0 && d[row - 1][col] == here + 1) {
        ret.push([row - 1, col])
    }
    if (row < d.length - 1 && d[row + 1][col] == here + 1) {
        ret.push([row + 1, col])
    }
    if (col > 0 && d[row][col - 1] == here + 1) {
        ret.push([row, col - 1])
    }
    if (col < d.length - 1 && d[row][col + 1] == here + 1) {
        ret.push([row, col + 1])
    }
    return ret
}

let head = []
for (let row = 0; row < d.length; row++) {
    for (let col = 0; col < d[row].length; col++) {
        if (d[row][col] == 0)
            head.push([row, col])
    }
}

function getKey(row, col) {
    return `${row},${col}`
}

function countTrail(row, col) {
    let score = {}
    let next = [[row, col, getKey(row, col)]]
    while (next.length > 0) {
        let [nrow, ncol, pastPath] = next.pop()
        pastPath = pastPath + "-" + getKey(nrow, ncol)
        if (d[nrow][ncol] == 9) {
            // console.log("Found 9 for " + row + "," + col + " " + score + " at " + nrow + "," + ncol)
            score[pastPath] = getKey(nrow, ncol)
        }
        // console.log("Checking " + nrow + "," + ncol + " " + d[nrow][ncol] + " I have left " + JSON.stringify(next))
        let ns = nextStep(nrow, ncol)
        for (let i = 0; i < ns.length; i++) {
            next.push([ns[i][0], ns[i][1], pastPath])
        }
    }
    return score
}

let part1 = 0
let part2=0
for (let i = 0; i < head.length; i++) {
    let trails = countTrail(head[i][0], head[i][1])
    part1 += new Set(Object.values(trails)).size
    part2 += Object.keys(trails).length
}

console.log("Part 1 score is " + part1)
console.log("Part 2 score is " + part2)