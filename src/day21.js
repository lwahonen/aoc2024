import {fetchInputData} from "./libraries.js";

const year = 2024
const day = 21;

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

let numbers = file.trim().split("\n")

function numberAt(row, col) {
    const numbers = [
        [7, 8, 9],
        [4, 5, 6],
        [1, 2, 3],
        [null, "0", "A"]
    ];
    return numbers[row] ? numbers[row][col] : undefined;
}

function coordsForNumber(num) {
    const coords = {
        7: [0, 0], 8: [0, 1], 9: [0, 2],
        4: [1, 0], 5: [1, 1], 6: [1, 2],
        1: [2, 0], 2: [2, 1], 3: [2, 2],
        0: [3, 1], "A": [3, 2]
    };
    return coords[num];
}

function diagAt(row, col) {
    const diags = {
        "0,1": "^",
        "0,2": "A",
        "1,0": "<",
        "1,1": "v",
        "1,2": ">"
    };
    return diags[`${row},${col}`];
}

function coordsForDiag(dir) {
    const coords = {
        "^": [0, 1],
        "A": [0, 2],
        "<": [1, 0],
        "v": [1, 1],
        ">": [1, 2]
    };
    return coords[dir];
}

let numberCache = {}

function solveNumber(row, col, targetNumber) {
    let currentNumber = numberAt(row, col)

    if (currentNumber == targetNumber) {
        return ["A"]
    }

    let cacheKey = `${currentNumber},${targetNumber}`

    if (numberCache[cacheKey] != undefined) {
        return numberCache[cacheKey]
    }

    let possibleAnswers = {}
    let [targetRow, targetCol] = coordsForNumber(targetNumber)

    let atOne = row == 2 && col == 0
    if (targetRow > row && !atOne) {
        let tails = solveNumber(row + 1, col, targetNumber)
        for (const tail of tails) {
            possibleAnswers["v" + tail] = true
        }
    }

    if (targetRow < row) {
        let tails = solveNumber(row - 1, col, targetNumber)
        for (const tail of tails) {
            possibleAnswers["^" + tail] = true
        }
    }

    let atZero = row == 3 && col == 1
    if (targetCol < col && !atZero) {
        let tails = solveNumber(row, col - 1, targetNumber)
        for (const tail of tails) {
            possibleAnswers["<" + tail] = true
        }
    }

    if (targetCol > col) {
        let tails = solveNumber(row, col + 1, targetNumber)
        for (const tail of tails) {
            possibleAnswers[">" + tail] = true
        }
    }
    let ret = Object.keys(possibleAnswers)
    // Only keep options that change direction as seldom as possible
    let goal = bestSwitch(ret);
    ret = ret.filter(r => switchBacks(r) <= goal)
    numberCache[cacheKey] = ret
    return ret
}

function switchBacks(a) {
    let ret = 0;
    for (let i = 1; i < a.length; i++) {
        if (a[i] != a[i - 1]) {
            ret++;
        }
    }
    return ret;
}

function bestSwitch(arr) {
    return Math.min(...arr.map(switchBacks));
}

let diagonalCache = {}

function solveDiag(row, col, targetDiag) {
    let currentDiag = diagAt(row, col)

    if (currentDiag == targetDiag) {
        return ["A"]
    }

    let cacheKey = `${currentDiag},${targetDiag}`

    if (diagonalCache[cacheKey] != undefined) {
        return diagonalCache[cacheKey]
    }

    let possibleAnswers = {}
    let [targetRow, targetCol] = coordsForDiag(targetDiag)

    if (targetRow > row) {
        let tails = solveDiag(row + 1, col, targetDiag)
        for (const tail of tails) {
            possibleAnswers["v" + tail] = true
        }
    }

    let atLeft = row == 1 && col == 0
    if (targetRow < row && !atLeft) {
        let tails = solveDiag(row - 1, col, targetDiag)
        for (const tail of tails) {
            possibleAnswers["^" + tail] = true
        }
    }

    let atUp = row == 0 && col == 1
    if (targetCol < col && !atUp) {
        let tails = solveDiag(row, col - 1, targetDiag)
        for (const tail of tails) {
            possibleAnswers["<" + tail] = true
        }
    }

    if (targetCol > col) {
        let tails = solveDiag(row, col + 1, targetDiag)
        for (const tail of tails) {
            possibleAnswers[">" + tail] = true
        }
    }
    let ret = Object.keys(possibleAnswers)
    // Only keep options that change direction as seldom as possible
    let goal = bestSwitch(ret);
    ret = ret.filter(r => switchBacks(r) <= goal)
    diagonalCache[cacheKey] = ret
    return ret
}

function processNumber(n) {
    let arr = ("A" + n).split("")
    let heads = [""]

    for (let i = 0; i < arr.length - 1; i++) {
        let current = arr[i]
        let next = arr[i + 1]
        let currentNumber = coordsForNumber(current)
        let moves = solveNumber(currentNumber[0], currentNumber[1], next)
        let newHeads = []
        for (const head of heads) {
            for (const move of moves) {
                newHeads.push(head + move)
            }
        }
        heads = newHeads
    }
    // Only keep options that change direction as seldom as possible
    let goal = bestSwitch(heads);
    heads = heads.filter(r => switchBacks(r) <= goal)
    return heads
}

function processDiagonal(n) {
    let arr = ("A" + n).split("")

    let heads = [""]
    for (let i = 0; i < arr.length - 1; i++) {
        let current = arr[i]
        let next = arr[i + 1]
        let currentNumber = coordsForDiag(current)
        let moves = solveDiag(currentNumber[0], currentNumber[1], next)
        let newHeads = []
        for (const head of heads) {
            for (const move of moves) {
                newHeads.push(head + move)
            }
        }
        heads = newHeads
    }
    // Only keep options that change direction as seldom as possible
    let goal = bestSwitch(heads);
    heads = heads.filter(r => switchBacks(r) <= goal)
    return heads
}

function punchInput(levels) {
    let ret = 0;
    for (let doorCode of numbers) {
        let shortLength = Number.MAX_VALUE;
        let arrowOptions = processNumber(doorCode);
        for (let arrows of arrowOptions) {
            let temp = findShortestSequence(arrows, levels, 0);
            shortLength = Math.min(shortLength, temp);
        }
        // console.log("For " + doorCode + " the shortest path is " + shortLength)
        let s = doorCode.replace("A", "")
        s = s.replace(/^0*/, "")
        let number = parseInt(s) * shortLength
        // console.log("Answer for " + doorCode + " is " + number)
        ret += number
    }
    return ret;
}

let fragmentCache = {}

function findShortestSequence(instr, maxLevel, currentLevel) {
    if (currentLevel === maxLevel) {
        return instr.length;
    }
    let cacheKey = `${instr},${currentLevel},${maxLevel}`;
    if (fragmentCache[cacheKey] !== undefined) {
        return fragmentCache[cacheKey];
    }
    // Get all the different ways these instructions can be punched at level + 1
    let nextCommands = processDiagonal(instr);
    let best = Number.MAX_VALUE;
    for (const nextCommand of nextCommands) {
        // Split the command into pieces separated by A
        // This lets us cache the results of the subcommands
        let parts = nextCommand.split('A')
        // IMPORTANT, DROP THE LAST A
        parts.pop()
        // Now we have a list of commands that can be punched at the next level
        // And get some use out of our cache
        let shortest = 0;
        for (let splitCommand of parts) {
            // See the +A in the recursive call? That's why we have to have pop above
            // And we have to add it back here so we can be sure our robot is chilling
            // back at square zero after each command
            shortest += findShortestSequence(splitCommand + "A", maxLevel, currentLevel + 1);
        }
        best = Math.min(best, shortest);
    }
    fragmentCache[cacheKey] = best;
    return best;
}

console.log("Part 1 " + punchInput(2))
console.log("Part 1 " + punchInput(25))