import { RoomTool } from "./RoomTool.model";

export class Room {

    constructor(
        public id: String,
        public capacity: number,
        public capacity70: number,
        public roomToolDtos: RoomTool[],
        public meetingsIds: number[]
        
    ) {

    }
}