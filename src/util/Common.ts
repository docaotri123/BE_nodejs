export default class Common {
    public static mapExistsInTwoArray(source: any[], destination: any[]) {
        return source.map((value, index) => {
            const isExists = destination[index] ? true : false;
            return { ...value, isExists: isExists };
        });
    }

    public static minStartDate(arr: any[]) {
        let min = arr[0];
        for (let i = 1; i < arr.length; i++) {
            const obj = arr[i];
            if (obj.startDate < min.startDate) {
                min = obj;
            }
        }
        return min;
    }

    public static maxEndDate(arr: any[]) {
        let max = arr[0];
        for (let i = 1; i < arr.length; i++) {
            const obj = arr[i];
            if (obj.endDate > max.endDate) {
                max = obj;
            }
        }
        return max;
    }

    public static getRandomInt(max: number) {
        return Math.floor(Math.random() * Math.floor(max));
    }
}