import { performance } from "perf_hooks";

export const data = [
    [0, 16, 255],
    [8, 128, 32],
    [0, 0, 0]
];

const K = 2;

const Rotation = (grid = data) => {
    const newArr = [];
    const n = grid.length;
    const m = grid[0].length;
    if (n !== m) {
        return grid;
    }
    // init new Arr
    for(let i = 0; i < n; i++) {
        newArr.push([]);
    }

    for (let i = 0; i < n ; i++) {
        for (let j = m -1; j >= 0 ; j--) {
            newArr[i].push(grid[j][i]);
        }
    }

    return newArr;
}

const RotationK = (grid = data, k: number) => {
    if (k <= 0) {
        return grid;
    }
    let result = Rotation(grid);;
    for (let i = 0; i < k -1 ; i++) {
        result = Rotation(result);
    }
    return result;
}

const getBitsOfNumber = (data: number) => {
    const bits = data.toString(2);
    return bits.length;
}

const getMemory2D = (grid = data) => {
    const n = grid.length;
    let results = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            results += getBitsOfNumber(grid[i][j]);
        }
    }
    return results;
}

const getTimeRotationK = () => {
    const t0 = performance.now();
    RotationK(data, K);
    const t1 = performance.now();
    return t1 - t0;
}


export const excercise1 = () => {

    return {
        data: RotationK(data, K),
        time: getTimeRotationK() + 'ms',
        memory: getMemory2D() +'bits'
    }
};