import {columns, fetchInputData, overlappedMatches} from "./libraries.js";

import crypto from "crypto";

const year = 2024
const day = 17;

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

let a = BigInt(file.trim().split("\n")[0].split(": ")[1])
let b = BigInt(file.trim().split("\n")[1].split(": ")[1])
let c = BigInt(file.trim().split("\n")[2].split(": ")[1])
let program = file.trim().split("Program: ")[1].split(",").map(b => parseInt(b))

function getCombo(op) {
    switch (op) {
        case 0:
            return 0n;
        case 1:
            return 1n;
        case 2:
            return 2n;
        case 3:
            return 3n;
        case 4:
            return a;
        case 5:
            return b;
        case 6:
            return c;
        default:
            console.log("Invalid operation");
    }
}

function div(a, b) {
    let den=2n ** b
    let res=a/ den
    return res
}

function runMachine() {
    let ip = 0
    let p1 = []
    while (ip < program.length) {
        let instr = program[ip]
        let literal = BigInt(program[ip + 1]);
        let combo = getCombo(program[ip + 1]);
        if (instr == 0) {
            a = div(a,combo)
        }
        if (instr == 1) {
            b = literal ^ b
        }
        if (instr == 2) {
            b = combo & 7n
        }
        if (instr == 3 && a != 0) {
            ip = program[ip + 1]
            continue
        }
        if (instr == 4) {
            b = c ^ b
        }
        if (instr == 5) {
            p1.push(combo & 7n)
        }
        if (instr == 6) {
            b = div(a,combo)
        }
        if (instr == 7) {
            c = div(a,combo)
        }
        ip += 2
    }
    return p1
}
BigInt.prototype.toJSON = function() { return this.toString() }
console.log("Part 1 "+JSON.stringify(runMachine()).replaceAll("\"", ""))

function compareTails(a,b, len) {
    let s = b.slice(b.length-len)
    if (s.length != a.length)
        return false
    for (let i = 0; i < s.length; i++) {
        if (BigInt(s[i]) != a[i])
            return false
    }
    return true
}

let bTemp= b
let cTemp= c
console.log("Starting the hunt for "+JSON.stringify(program)+". Pay attention to last digits")

// Every number in the program is represented by three bits in our answer
// First find the number 1..8 that gives us the correct last number
// Multiply that by 8 to lock in the last number

// Then find the number 1..8 that gives us the correct second to last number
// Multiply that by 8 to lock in the second to last number

// Continue until we have the entire program
function findNextDigit(currentDigit, solvedDigits) {
    let foundDigits = solvedDigits * 8n;
    for (let i = 0n; i < 8n; i++) {
        let candidate = foundDigits + i;
        a = candidate
        b = bTemp
        c = cTemp
        let result = runMachine()
        if (compareTails(result, program, currentDigit)) {
            // Printing in octal to show the patter of candidate vs resulting program. The first digits of the base 8
            // Stay the same == the last digits of the program stay the same
            console.log("Found tail length " + currentDigit + " for " + JSON.stringify(result) + " octal " + candidate.toString(8) +" in decimal "+candidate)
            if (currentDigit == program.length) {
                return candidate
            }
            let ret = findNextDigit(currentDigit + 1, candidate)
            if (ret != -1)
                return ret
        }
    }
    return -1
}

console.log("Part 2 "+findNextDigit(1, 0n))
