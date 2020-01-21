export class ErrorMessage {
    message: string;
    details: any;
    code: string;

    constructor(userMessage: string, internalMessage: any, code: string) {
        this.code = code;
        this.message = userMessage;
        this.details = internalMessage;
    }
}
