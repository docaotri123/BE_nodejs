export class Authorizer {
    constructor(allow: boolean, user: any) {
        this.allow = allow;
        this.user = user;
    }
    allow: boolean;
    user: any;
}
