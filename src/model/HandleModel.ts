export class HandleObj {
    status: boolean;
    err: any;
    data: any;

    constructor(status: boolean, err?: any, data?: any) {
        this.status = status;
        this.err = err;
        this.data = data;
    }
}
