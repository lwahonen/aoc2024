import {fetchInputData} from "./libraries.js";

const year = 2024
const day = 5;

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
// file=
//     `47|53
// 97|13
// 97|61
// 97|47
// 75|29
// 61|13
// 75|53
// 29|13
// 97|29
// 53|29
// 61|53
// 97|53
// 61|29
// 47|13
// 75|47
// 97|75
// 47|61
// 75|61
// 47|29
// 75|13
// 53|13
//
// 75,47,61,53,29
// 97,61,53,29,13
// 75,29,13
// 75,97,47,61,53
// 61,13,29
// 97,13,75,29,47`

let input = file.trim().split("\n\n")
let pairs = input[0].trim().split("\n").map(c=> {
    let b=c.split("|")
    return [parseInt(b[0]), parseInt(b[1])]

})
let list = input[1].trim().split("\n").map(c=>c.split(",").map(v=>parseInt(v)))

function checkPairs(a, b) {
    for (const pair of pairs) {
        if (pair[0] == a && pair[1] == b)
            return -1
        if (pair[1] == a && pair[0] == b)
            return 1
    }
    return 0
}


let part1 = 0
let part2 =0

for (const update of list) {
    let s=update.toSorted(checkPairs)
    let s1 = update.toString();
    if(s.toString() == s1){
        let number = update[Math.floor(update.length / 2)];
        console.log("Update in right order " + s1 + " picking " + number)
        part1 += number
    }
    else
    {
        console.log("Update not in right order " + update.toString())
        let number = s[Math.floor(s.length / 2)];
        console.log("Update in right order " + s.toString() + " picking " + number)
        part2 += number
    }
}

console.log("Part 1 " + part1)
console.log("Part 2 " + part2)
