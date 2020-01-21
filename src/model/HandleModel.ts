import { ErrorMessage } from "./ErrorMessageModel";

export class HandleObj {
    code: number;
    mess: any;
    error: ErrorMessage;
    data: any;

    constructor(code: number, mess: string, error?: ErrorMessage ,data?: any) {
        this.code = code;
        this.mess = mess;
        this.error = error;
        this.data = data;
    }
}
