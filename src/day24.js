import {fetchInputData} from "./libraries.js";
import os from "os";
import * as fs from "fs";

const year = 2024
const day = 24;

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
// file =
//     `
// x00: 0
// x01: 1
// x02: 0
// x03: 1
// x04: 0
// x05: 1
// y00: 0
// y01: 0
// y02: 1
// y03: 1
// y04: 0
// y05: 1
//
// x00 AND y00 -> z05
// x01 AND y01 -> z02
// x02 AND y02 -> z01
// x03 AND y03 -> z03
// x04 AND y04 -> z04
// x05 AND y05 -> z00
// `
let savedMaxBits = -1

let incoming = {}
file.trim().split("\n\n")[0].split("\n").map(b => {
    let strings = b.split(": ");
    incoming[strings[0]] = parseInt(strings[1])
    return strings;
})

let rules = file.trim().split("\n\n")[1].split("\n").map((b, index) => {
    let strings = b.split(" -> ");
    let c = strings[1]
    let a = strings[0].split(" ")
    let rule = {par1: a[0], op: a[1], par2: a[2], to: c, id: index}
    return rule
})

function haveAllZs(values) {
    for (const rule of rules) {
        if (!values.hasOwnProperty(rule.to)) {
            return false
        }
    }
    return true
}

function solvePart1(values, rules) {
    while (!haveAllZs(values)) {
        for (const rule of rules) {
            if (!values.hasOwnProperty(rule.par1) || !values.hasOwnProperty(rule.par2)) {
                continue
            }
            let a = values[rule.par1]
            let b = values[rule.par2]
            let result = 0
            if (rule.op === "AND") {
                result = a & b
            }
            if (rule.op === "OR") {
                result = a | b
            }
            if (rule.op === "XOR") {
                result = a ^ b
            }
            values[rule.to] = result
        }
    }

    let p1 = ""
    for (let i = 0; i < 100; i++) {
        let v = 0
        let key = ""
        if (i < 10) {
            key = `z0${i}`;
        } else {
            key = `z${i}`;
        }
        if (!values.hasOwnProperty(key)) {
            break
        }
        v = values[key]
        p1 += v
    }
    return parseInt(stringReverse(p1), 2)
}

function stringReverse(s) {
    return s.split("").reverse().join("")
}

console.log("Max bits " + maxBits())
console.log("Part 1 " + solvePart1(incoming, rules))

function maxBits() {
    if (savedMaxBits > 0) {
        return savedMaxBits
    }
    for (let i = 0; i < 100; i++) {
        let v = 0
        let key = ""
        if (i < 10) {
            key = `z0${i}`;
        } else {
            key = `z${i}`;
        }
        let found = false
        for (const rule of rules) {
            if (rule.to == key) {
                found = true
                break
            }
        }
        if (!found) {
            savedMaxBits = i
            return i
        }
    }
    return 0;
}

function getOutputPin(a, b, operator) {
    for (const rule of rules) {
        if (rule.par1 == a && rule.par2 == b && rule.op == operator) {
            return rule.to
        }
        if (rule.par2 == a && rule.par1 == b && rule.op == operator) {
            return rule.to
        }
    }
}

let brokenGates = []
// Follow input signals to output ports, fix every broken gate on the way
function fixBrokenGates() {
    let previousCarryBit = null
    for (let i = 0; i < maxBits()-1; i++) {
        let key = `${i}`.padStart(2, 0)
        let  fullOutputBit, fullCarryBit

        // Find the registers that hold the results from adding the current bit
        let halfAnswerBit = getOutputPin(`x${key}`, `y${key}`, 'XOR')
        let halfCarryBit = getOutputPin(`x${key}`, `y${key}`, 'AND')

        // It's a full adder and the previous results are just intermediate results
        if (previousCarryBit !== null) {
            let carryOverFlow = getOutputPin(previousCarryBit, halfAnswerBit, 'AND')
            // Did not find gate that matches the previous carry bit and the current answer bit
            // Those two outputs must be crossed
            if (!carryOverFlow) {
                let temp=halfAnswerBit
                halfAnswerBit=halfCarryBit
                halfCarryBit=temp
                brokenGates.push(halfAnswerBit, halfCarryBit)
                carryOverFlow = getOutputPin(previousCarryBit, halfAnswerBit, 'AND')
            }

            fullOutputBit = getOutputPin(previousCarryBit, halfAnswerBit, 'XOR')

            // A full adder should not output the intermediate results
            // The lines between the actual output and the intermediate results must be crossed
            // On bit number zero this is on purpose, as it's a half adder
            // However, we don't get to this line if it's not a full adder
            if (halfAnswerBit !== undefined && halfAnswerBit.startsWith('z')) {
                let temp=halfAnswerBit
                halfAnswerBit=fullOutputBit
                fullOutputBit=temp
                brokenGates.push(halfAnswerBit, fullOutputBit)
            }

            // The lines between the intermediate carry and the output must be crossed
            if (halfCarryBit !== undefined && halfCarryBit.startsWith('z')) {
                let temp=halfCarryBit
                halfCarryBit=fullOutputBit
                fullOutputBit=temp
                brokenGates.push(halfCarryBit, fullOutputBit)
            }

            // The carry-forward is supposed to go to the next bit
            // Not the output line!
            if (carryOverFlow !== undefined && carryOverFlow.startsWith('z')) {
                let temp=carryOverFlow
                carryOverFlow=fullOutputBit
                fullOutputBit=temp
                brokenGates.push(carryOverFlow, fullOutputBit)
            }

            // This does get verified below
            fullCarryBit = getOutputPin(carryOverFlow, halfCarryBit, 'OR')
        }

        // The last adder is treated differently,
        // as there's one extra output lane for displaying the last carry bit
        // If we are not at that last adder, our carry forward line is swapped with the actual output
        if (fullCarryBit !== undefined && fullCarryBit.startsWith('z') && fullCarryBit !== 'z45') {
            let temp=fullCarryBit
            fullCarryBit=fullOutputBit
            fullOutputBit=temp
            brokenGates.push(fullCarryBit, fullOutputBit)
        }

        if (previousCarryBit) {
            previousCarryBit = fullCarryBit
        } else {
            previousCarryBit = halfCarryBit
        }
    }
}

fixBrokenGates()

console.log('Part 2', brokenGates.sort().join(','))
