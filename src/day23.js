import {fetchInputData} from "./libraries.js";

const year = 2024
const day = 23;

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
// #.#####################
// #.......#########...###
// #######.#########.#.###
// ###.....#.>.>.###.#.###
// ###v#####.#v#.###.#.###
// ###.>...#.#.#.....#...#
// ###v###.#.#.#########.#
// ###...#.#.#.......#...#
// #####.#.#.#######.#.###
// #.....#.#.#.......#...#
// #.#####.#.#.#########v#
// #.#...#...#...###...>.#
// #.#.#v#######v###.###v#
// #...#.>.#...>.>.#.###.#
// #####v#.#.###v#.#.###.#
// #.....#...#...#.#.#...#
// #.#########.###.#.#.###
// #...###...#...#...#.###
// ###.###.#.###v#####v###
// #...#...#.#.>.>.#.>.###
// #.###.###.#.###.#.#v###
// #.....###...###...#...#
// #####################.#
// `
let connections = file.trim().split("\n").map(b => b.split("-"))

let computers = {}
for (const connection of connections) {
    computers[connection[0]] = computers[connection[0]] || []
    computers[connection[0]].push(connection[1])
    computers[connection[1]] = computers[connection[1]] || []
    computers[connection[1]].push(connection[0])
}

let validTriples = {}
for (const computer of Object.keys(computers)) {
    let neigh = computers[computer]
    let triples = {}
    for (let i = 0; i < neigh.length; i++) {
        for (let j = i; j < neigh.length; j++) {
            if (computers[neigh[i]].includes(neigh[j])) {
                let t = [computer, neigh[i], neigh[j]].toSorted()
                triples[t.join("-")] = t
            }
        }
    }
    for (const key of Object.keys(triples)) {
        let value = triples[key];
        if (value.some(valueElement => valueElement[0] == "t")) {
            validTriples[key] = true;
        }
    }
}
console.log("Part 1 " + Object.keys(validTriples).length)

let largest=0
let largestName=""
for (const name of Object.keys(computers)) {
    let check = [name]
    let conn = []
    while (check.length > 0) {
        let item = check.pop();
        if (conn.includes(item))
            continue
        let allConnected = true
        // Make sure every candidate is connected to all the others
        allConnected = conn.every(existing => computers[item].includes(existing));
        if (!allConnected)
            continue
        conn.push(item)
        let neigh = computers[item]
        for (const n of neigh) {
            if (!conn.includes(n))
                check.push(n)
        }
    }
    if (conn.length > largest) {
        largest = conn.length
        conn.sort()
        largestName = conn.join(",")
    }
}
console.log("Part 2 size " + largest + ", answer " + largestName)
