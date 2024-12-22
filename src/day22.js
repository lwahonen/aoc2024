import {fetchInputData} from "./libraries.js";

const year = 2024
const day = 22;

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
// ///////////////////////////////////////////////////
// file =
//     `
// 1
// 2
// 3
// 2024
// `
let allSecrets = file.trim().split("\n").map(n => BigInt(parseInt(n)))

function getNextSecret(secret) {
    let next = 64n * secret
    secret = next ^ secret
    secret = secret % 16777216n

    let mod = secret / 32n
    secret = secret ^ mod
    secret = secret % 16777216n

    let last = 2048n * secret
    secret = last ^ secret
    secret = secret % 16777216n
    return secret
}

let part1 = 0n
for (let start of allSecrets) {
    for (let i = 0; i < 2000; i++) {
        start = getNextSecret(start)
    }
    part1 += start
}
console.log("Part 1 " + part1)

let priceCaches = {}

function printArr(target) {
    return target.map(n => n === null ? "NULL" : n.toString()).join(",")
}

function arrayHasNull(diffs) {
    for (let i = 0; i < diffs.length; i++) {
        if (diffs[i] === null) {
            return true
        }
    }
    return false
}

function warmCache(secret) {
    priceCaches[secret] = {}
    let initial = secret
    let lasts = secret % 10n
    let diffs = [null, null, null, null]
    for (let i = 0; i < 2000; i++) {
        secret = getNextSecret(secret)
        let thisPrice = secret % 10n
        let d = thisPrice - lasts
        diffs.shift()
        diffs.push(d)
        lasts = thisPrice
        if (arrayHasNull(diffs))
            continue

        let innerKey = `${printArr(diffs)}`
        if (priceCaches[initial][innerKey] === undefined)
            priceCaches[initial][innerKey] = thisPrice
    }
}

for (const initialSecret of allSecrets) {
    warmCache(initialSecret)
}
let part2 = 0n
let checked = {}
for (const initialSecret of Object.keys(priceCaches)) {
    let alldiffs = priceCaches[initialSecret]
    for (const key of Object.keys(alldiffs)) {
        if (checked[key] !== undefined)
            continue
        checked[key] = true
        let c = 0n
        for (const allSecret of allSecrets) {
            if (priceCaches[allSecret][key] !== undefined)
                c += priceCaches[allSecret][key]
        }


        if (c > part2) {
            console.log("Found better banana deal " + c)
            part2 = c
        }
    }
}

console.log("Part 2 " + part2)