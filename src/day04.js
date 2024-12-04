import {columns, fetchInputData, overlappedMatches, rotate} from "./libraries.js";

const year = 2024
const day = 4;

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

let part1 = 0
let part2 = 0

let r=file.trim().split("\n")
for (const string of r) {
    part1 += overlappedMatches(string, /XMAS/).length
    part1 += overlappedMatches(string, /SAMX/).length
}

for (const col of columns(r)) {
    let string = col.join("");
    part1 += overlappedMatches(string, /XMAS/).length
    part1 += overlappedMatches(string, /SAMX/).length
}

function findDiagonal(r) {
    let ret = 0
    for (let row = 0; row < r.length - 3; row++) {
        for (let col = 0; col < r.length - 3; col++) {
            let t = r[row][col] + r[row + 1][col + 1] + r[row + 2][col + 2] + r[row + 3][col + 3]
            if (t == "XMAS")
                ret++
        }
    }
    return ret
}

// Just rotate it four times to get all four different ways it can be diagonal
for (let i = 0; i < 4; i++) {
    part1 += findDiagonal(r);
    r = rotate(r)
}

console.log("Part 1 " + part1)

function findStar() {
    let ret = 0
    for (let row = 0; row < r.length - 2; row++) {
        for (let col = 0; col < r[row].length - 2; col++) {
            let center = r[row + 1][col + 1];
            let tl = r[row][col];
            let tr = r[row][col + 2];
            let bl = r[row + 2][col];
            let br = r[row + 2][col + 2];

            let masCount = 0
            // MAS can be top-left -> bottom right, top-right -> bottom left etc
            if (center == "A") {
                if (tl == "M" && br == "S")
                    masCount++
                if (br == "M" && tl == "S")
                    masCount++
                if (bl == "M" && tr == "S")
                    masCount++
                if (tr == "M" && bl == "S")
                    masCount++
            }

            if (masCount == 2) {
                ret++
            }
        }
    }
    return ret
}

part2 = findStar();

console.log("Part 2 " + part2)
