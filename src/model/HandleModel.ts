export class HandleObj {
    status: boolean;
    code: number;
    mess: any;
    data: any;

    constructor(status: boolean, code: number, mess?: any, data?: any) {
        this.status = status;
        this.code = code;
        this.mess = mess;
        this.data = data;
    }
}
