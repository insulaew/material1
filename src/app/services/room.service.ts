import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Room } from "../models/Room.model";

@Injectable()
export class RoomService {

    constructor(
		private httpClient: HttpClient
	) { }

    getRooms() {
        return this.httpClient.get<any>('http://localhost:9099/api/Salles');
    }

    getRoomsCompatibleForMeeting(numberOfPersons: number, meetingStartHour: number) {
        const options = { params: new HttpParams().set('numberOfPersons', numberOfPersons).set('meetingStartHour', meetingStartHour) };
        return this.httpClient.get<Room[]>('http://localhost:9099/api/SallesCompatiblesPourMeeting', options);
    }

    getRoomsCompatibleForMeetingEmergency(numberOfPersons: number, meetingStartHour: number) {
        const options = { params: new HttpParams().set('numberOfPersons', numberOfPersons).set('meetingStartHour', meetingStartHour) };
        return this.httpClient.get<Room[]>('http://localhost:9099/api/SallesCompatiblesPourMeetingEmergency', options);
    }
    
}