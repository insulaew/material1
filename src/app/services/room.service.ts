import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Room } from "../models/Room.model";

const MEETING_PLANNER_API = 'http://localhost:9099/api/';

@Injectable()
export class RoomService {

    constructor(
        private httpClient: HttpClient) { }

    /**On récupère les salles en base de données. */
    getRooms() {
        return this.httpClient.get<Room[]>(MEETING_PLANNER_API + 'Salles');
    }

    /**On récupère les salles compatibles pour une réunion en base de données. */
    getRoomsCompatibleForMeeting(numberOfPersons: number, meetingStartHour: number) {
        const options = { params: new HttpParams().set('numberOfPersons', numberOfPersons).set('meetingStartHour', meetingStartHour) };
        return this.httpClient.get<Room[]>(MEETING_PLANNER_API + 'SallesCompatiblesPourMeeting', options);
    }

}