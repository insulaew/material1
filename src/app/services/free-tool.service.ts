import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FreeTool } from "../models/FreeTool.model";

@Injectable()
export class FreeToolService {

	constructor(
		private httpClient: HttpClient
	) { }

	getFreeTools() {
		return this.httpClient.get<FreeTool[]>('http://localhost:9099/api/EquipementsLibres');
	}

    getFreeToolsByTypeCompatibleForMeeting(type: string, meetingStartHour: number) {
		const options = { params: new HttpParams().set('type', type).set('meetingStartHour', meetingStartHour) };
		return this.httpClient.get<FreeTool[]>('http://localhost:9099/api/EquipementsLibresByType', options);
	}

}