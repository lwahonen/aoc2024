import {columns, fetchInputData, overlappedMatches} from "./libraries.js";

import crypto from "crypto";

const year = 2024
const day = 14;

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


function parseBot(b) {
    let parts = b.split(" ")
    let pos = parts[0].split("=")[1].split(",")
    let px = parseInt(pos[0])
    let py = parseInt(pos[1])
    let vel = parts[1].split("=")[1].split(",")
    let vx = parseInt(vel[0])
    let vy = parseInt(vel[1])
    return {px, py, vx, vy}
}

let matr = file.trim().split("\n").map(b => parseBot(b))

let tall = 103
let wide = 101

let mtall = Math.floor(tall / 2)
let mwide = Math.floor(wide / 2)

let q1 = 0
let q2 = 0
let q3 = 0
let q4 = 0

for (const botElements of Object.values(getBots(100))) {
    for (const pixel of botElements) {
        if (pixel.col < mwide && pixel.row < mtall)
            q1++
        if (pixel.col > mwide && pixel.row < mtall)
            q2++
        if (pixel.col < mwide && pixel.row > mtall)
            q3++
        if (pixel.col > mwide && pixel.row > mtall)
            q4++
    }
}
console.log("Part 1 " + q1 * q2 * q3 * q4)

function getBots(rounds) {
    let bots = {}
    for (const bot of matr) {
        let finalX = (bot.px + bot.vx * rounds) % wide
        let finalY = (bot.py + bot.vy * rounds) % tall
        if (finalX < 0)
            finalX = wide + finalX
        if (finalY < 0)
            finalY = tall + finalY
        if (finalX == wide)
            finalX = 0
        if (finalY == tall)
            finalY = 0
        if (bots[`row:${finalY}col:${finalX}`] == undefined)
            bots[`row:${finalY}col:${finalX}`] = []
        bots[`row:${finalY}col:${finalX}`].push({col: finalX, row: finalY})
    }
    return bots;
}

for (let rr = 0; rr < Number.MAX_VALUE; rr++) {
    let bots = getBots(rr);
    // Assumption: To print the TREE?!!, all bots must be in a unique position
    let print = true
    for (const bot in bots) {
        if (bots[bot].length > 1) {
            print = false
            break
        }
    }
    if (!print)
        continue
    console.log("Tree found on round " + rr + "\n\n")

    for (let row = 0; row < tall; row++) {
        let st = ""
        for (let col = 0; col < wide; col++) {
            if (bots[`row:${row}col:${col}`] == undefined)
                st += "."
            else
                st += bots[`row:${row}col:${col}`].length
        }
        console.log(st)
    }
    if (print)
        break
}


