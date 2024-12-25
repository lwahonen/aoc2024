import {columns, fetchInputData} from "./libraries.js";
import os from "os";
import * as fs from "fs";

const year = 2024
const day = 25;

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

let ss = file.trim().split("\n\n").map(b => b.split("\n"))

function isKey(c) {
    let topEmpty = c[0].includes(".")
    let topFilled = c[0].includes("#")
    let bottomEmpty = c[c.length - 1].includes(".")
    let bottomFilled = c[c.length - 1].includes("#")
    if (topEmpty && bottomFilled) {
        return "key"
    }
    if (topFilled && bottomEmpty) {
        return "door"
    }
    return "none"
}

let keys = []
let doors = []

let maxVal = 0

for (const s of ss) {
    maxVal = s[0].length
    let vals = columns(s)
    if (isKey(s) === "key") {
        let key = vals.map(b => b.length - b.indexOf("#") - 1);
        keys.push(key)
    }
    if (isKey(s) === "door") {
        let door = vals.map(b => b.indexOf(".") - 1);
        doors.push(door)
    }
}

let part1 = 0
for (const key of keys) {
    for (const door of doors) {
        if (key.every((k, i) => maxVal - door[i] >= k)) {
            part1++
        }
    }
}

console.log(part1)