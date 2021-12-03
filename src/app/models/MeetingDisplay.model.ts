import { FreeTool } from "./FreeTool.model";
import { Room } from "./Room.model";
import { User } from "./User.model";

export class MeetingDisplay {

    constructor(
        public id: number,
        public type: string,
        public userName: string,
        public startHour: number,
        public endHour: number,
        public numberOfPersons: number,
        public reserved: boolean,
        public roomCode: string,
        public freeToolDtos: FreeTool[]
    ) {

    }
}