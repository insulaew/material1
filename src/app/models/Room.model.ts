import { RoomTool } from "./RoomTool.model";

export class Room {

    constructor(
        public id: string,
        public capacity: number,
        public capacity70: number,
        public roomToolDtos: RoomTool[],
        public meetingsIds: number[]) {
    }

}