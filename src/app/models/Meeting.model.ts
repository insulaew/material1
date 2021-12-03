import { FreeTool } from "./FreeTool.model";
import { Room } from "./Room.model";
import { User } from "./User.model";

export class Meeting {

    constructor(
        public id: number,
        public type: String,
        public userDto: User|null,
        public startHour: number,
        public endHour: number,
        public numberOfPersons: number,
        public reserved: boolean,
        public roomDto: Room|null,
        public freeToolDtos: FreeTool[]
    ) {

    }
}