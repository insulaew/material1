import { Optional } from "@angular/core";
import { FreeTool } from "./FreeTool.model";
import { Room } from "./Room.model";
import { User } from "./User.model";

export class Meeting {

    constructor(
        public id: number,
        public type: string,
        @Optional() public userDto: User,
        public startHour: number,
        public endHour: number,
        public numberOfPersons: number,
        public isReserved: boolean,
        @Optional() public roomDto: Room,
        public freeToolDtos: FreeTool[]) {
    }

}