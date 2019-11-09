export const data = [
    [0, 16, 255],
    [8, 128, 32],
    [0, 0, 0]
];
const Rotation = (grid = data) => {
    const newArr = [];
    const n = grid.length;
    const m = grid[0].length;
    if (n !== m) {
        return { isSuccess: false, data: grid };
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

    return { isSuccess: true, data: newArr }
}

export const RotationK = (grid = data, k) => {
    let result = Rotation(grid);;
    for (let i = 0; i < k -1 ; i++) {
        result = Rotation(result.data);
    }
    return result;
}