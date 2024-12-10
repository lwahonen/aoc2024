import {columns, fetchInputData} from "./libraries.js";

const year = 2024
const day = 9;

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

let d = file.trim().split("").map(r=>parseInt(r))

let disk=[]
for (let i = 0; i < d.length; i++) {
    if (i % 2 == 0) {
        for (let j = 0; j < d[i]; j++) {
            disk.push(i / 2)
        }
    } else {
        for (let j = 0; j < d[i]; j++) {
            disk.push(-1)
        }
    }
}

for (let left = 0; left < disk.length; left++) {
    if (disk[left] != -1)
        continue

    for (let right = disk.length - 1; right >= 0; right--) {
        if (left >= right)
            break
        const diskElement = disk[right];
        if (diskElement == -1)
            continue
        disk[left] = diskElement
        disk[right] = -1
        break
    }
}

let part1=0
for (let i = 0; i < disk.length; i++) {
    if (disk[i] != -1)
        part1 += disk[i] * i
}
console.log("Part 1 "+part1)

// Reinitialize
disk=[]
for (let i = 0; i < d.length; i++) {
    if (i % 2 == 0) {
        for (let j = 0; j < d[i]; j++) {
            disk.push(i / 2)
        }
    } else {
        for (let j = 0; j < d[i]; j++) {
            disk.push(-1)
        }
    }
}

let moved=[]
for (let right = disk.length - 1; right > 0; right--) {
    const fileId = disk[right];
    if (fileId === -1)
        continue
    if(moved.includes(fileId)) {
        continue
    }
    let fileStart = right
    while (disk[fileStart] === fileId && fileStart > 0) {
        fileStart--
    }
    let fileSize = right - fileStart
    let left = 0
    let fits = false
    for (; left < right; left++) {
        if (disk[left] != -1)
            continue
        fits=true
        for (let i = 0; i < fileSize; i++) {
            if (disk[left + i] != -1) {
                fits = false
                left += i
                break
            }
        }
        if (fits)
            break
    }

    if (fits) {
        for (let i = 0; i < fileSize; i++) {
            disk[left + i] = fileId
            disk[right - i] = -1
        }
        moved.push(fileId)
    }
    right = fileStart+1
}


let part2=0
for (let i = 0; i < disk.length; i++) {
    if (disk[i] != -1)
        part2 += disk[i] * i
}
console.log("Part 2 "+part2)

