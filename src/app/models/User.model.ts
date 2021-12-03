export class User {

    constructor(
        public id: number|null,
        public firstName: string,
        public lastName: string,
        public email: string,
        public password: string,
        public meetingsIds: number[]) {
    }

}