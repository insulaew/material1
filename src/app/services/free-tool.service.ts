import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FreeTool } from "../models/FreeTool.model";

const MEETING_PLANNER_API = 'http://localhost:9099/api/';

@Injectable()
export class FreeToolService {

	constructor(
		private httpClient: HttpClient) { }

	/**On récupère les outils libres en base de données. */
	getFreeTools() {
		return this.httpClient.get<FreeTool[]>(MEETING_PLANNER_API + 'EquipementsLibres');
	}

	/**On récupère les outils libres d'un type donné disponibles à une heure précise pour une réunion. */
	getFreeToolsByTypeCompatibleForMeeting(type: string, meetingStartHour: number) {
		const options = { params: new HttpParams().set('type', type).set('meetingStartHour', meetingStartHour) };
		return this.httpClient.get<FreeTool[]>(MEETING_PLANNER_API + 'EquipementsLibresByType', options);
	}

}