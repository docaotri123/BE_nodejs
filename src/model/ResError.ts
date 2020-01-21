import { ErrorMessage } from "./ErrorMessageModel";

export class ResError {
    error: ErrorMessage;

    constructor(error: ErrorMessage) {
        this.error = error;
    }
}
