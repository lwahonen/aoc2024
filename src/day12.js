import {columns, fetchInputData, overlappedMatches} from "./libraries.js";

const year = 2024
const day = 12;

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

let d = file.trim().split("\n").map(b => b.split(""))

let visited = {}

let part1 = 0
let part2 = 0

let parts = {}

for (let row = 0; row < d.length; row++) {
    for (let col = 0; col < d[0].length; col++) {
        let key = `${row},${col}`
        if (visited[key]) {
            continue
        }
        let letter = get(row, col)
        if (!parts[key]) {
            parts[key] = []
        }
        let fill = [[row, col]]
        while (fill.length > 0) {
            let [nrow, ncol] = fill.pop()
            let neighLetter = get(nrow, ncol)

            if (visited[`${nrow},${ncol}`]) {
                continue
            }

            if (neighLetter == letter) {
                visited[`${nrow},${ncol}`] = true
                parts[key].push([nrow, ncol])
                fill.push([nrow - 1, ncol])
                fill.push([nrow + 1, ncol])
                fill.push([nrow, ncol - 1])
                fill.push([nrow, ncol + 1])
            }
        }
    }

}

for (let key in parts) {
    let part = parts[key]
    let edge = 0
    let letter = d[part[0][0]][part[0][1]]
    for (const [partRow, partCol] of part) {
        if (get(partRow - 1, partCol) != letter)
            edge++
        if (get(partRow + 1, partCol) != letter)
            edge++
        if (get(partRow, partCol - 1) != letter)
            edge++
        if (get(partRow, partCol + 1) != letter)
            edge++
    }
    // console.log("Region of " + letter + " has " + part.length + " cells and " + edge + " edge cells")
    part1 += edge * part.length
}

function get(row, col) {
    if (row < 0 || row >= d.length || col < 0 || col >= d[0].length)
        return "-"
    return d[row][col]
}

function haveMatch(row, col, edges) {
    for (const square of edges) {
        if (square.row == row && square.col == col)
            return square
    }
    return null
}

function handleEdge(squares, rowStep, colStep) {
    let score = 0
    for (const s of squares) {
        if (s.counted)
            continue
        score++
        let marks = [s]
        while (marks.length > 0) {
            let n = marks.pop()
            if (n.counted)
                continue
            let l = haveMatch(n.row - rowStep, n.col - colStep, squares)
            let r = haveMatch(n.row + rowStep, n.col + colStep, squares)
            if (l != null && !l.counted)
                marks.push(l)
            if (r != null && !r.counted)
                marks.push(r)
            n.counted = true
        }
    }
    return score
}

for (let key in parts) {
    let part = parts[key]
    let letter = d[part[0][0]][part[0][1]]
    let ups = []
    let downs = []
    let lefts = []
    let rights = []
    for (const [row, col] of part) {
        let up = get(row - 1, col)
        let down = get(row + 1, col)
        let left = get(row, col - 1)
        let right = get(row, col + 1)
        if (up != letter)
            ups.push({counted: false, row: row, col: col})
        if (down != letter)
            downs.push({counted: false, row: row, col: col})
        if (left != letter)
            lefts.push({counted: false, row: row, col: col})
        if (right != letter)
            rights.push({counted: false, row: row, col: col})
    }
    let l = handleEdge(lefts, 1, 0);
    // console.log("Part " + letter + " has " + l + " edge cells on left")
    part2 += l * part.length;

    let u = handleEdge(ups, 0, 1);
    // console.log("Part " + letter + " has " + u + " edge cells on top")
    part2 += u * part.length;

    let dd = handleEdge(downs, 0, 1);
    // console.log("Part " + letter + " has " + dd + " edge cells on bottom")
    part2 += dd * part.length;

    let r = handleEdge(rights, 1, 0);
    // console.log("Part " + letter + " has " + r + " edge cells on right")
    part2 += r * part.length;
}

console.log("Part 1 " + part1)
console.log("Part 2 " + part2)

