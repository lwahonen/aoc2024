import {columns, fetchInputData} from "./libraries.js";

const year = 2024
const day = 13;

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

let part1=0
let part2=0

// file=
//     `
//     Button A: X+94, Y+34
// Button B: X+22, Y+67
// Prize: X=8400, Y=5400
//
// Button A: X+26, Y+66
// Button B: X+67, Y+21
// Prize: X=12748, Y=12176
//
// Button A: X+17, Y+86
// Button B: X+84, Y+37
// Prize: X=7870, Y=6450
//
// Button A: X+69, Y+23
// Button B: X+27, Y+71
// Prize: X=18641, Y=10279
// `
function parsePrice(z) {
    let lines = z.trim().split("\n")
    let a = lines[0].split(": ")[1].split(", ").map(b => parseInt(b.substr(2)))
    let b = lines[1].split(": ")[1].split(", ").map(b => parseInt(b.substr(2)))
    let p = lines[2].split(": ")[1].split(", ").map(b => parseInt(b.substr(2)))
    return {a: a, b: b, p: p}
}

function winnable(v, adjust) {
    let a = v.a
    let b = v.b
    let p = v.p
    let targetX = p[0] + adjust;
    let targetY = p[1] + adjust;

    // aPressed * a[0] + bPressed * b[0] = targetX
    // aPressed * a[1] + bPressed * b[1] = targetY
    // Solve for bPressed => bPressed = (targetX * a[1] - targetY * a[0]) / (a[1] * b[0] - b[1] * a[0])
    // Use that to get aPressed
    // Check if it is a valid solution, if not, return null
    // Math.trunc is carrying the team here, you'll get spicy half-button presses without it
    let bPressed = Math.trunc((targetX * a[1] - targetY * a[0]) / (a[1] * b[0] - b[1] * a[0]))
    let aPressed = Math.trunc((targetX - bPressed * b[0]) / a[0])
    if (aPressed * a[0] + bPressed * b[0] == targetX && aPressed * a[1] + bPressed * b[1] == targetY) {
        return {a: aPressed, b: bPressed, price: aPressed * 3 + bPressed}
    }
    return null
}

let input=file.trim().split("\n\n").map(z=>parsePrice(z))
for (let v of input) {
    let canWin1 = winnable(v, 0)
    if (canWin1 != null) {
        part1 += canWin1.price
    }
}
console.log("Part 1 "+ +part1)

for (let v of input) {
    let canWin2 = winnable(v,10000000000000)
    if (canWin2 != null) {
        part2 += canWin2.price
    }
}

console.log("Part 2 "+part2)

