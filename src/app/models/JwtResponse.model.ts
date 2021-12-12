export class JwtResponse {

    constructor(
        public token: string,
        public type: string,
        public id: number,
        public username: string,
        public email: string,
        public role: string) {
    }

}