import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { Meeting } from "../models/Meeting.model";

const MEETING_PLANNER_API = 'http://localhost:9099/api/';

@Injectable()
export class MeetingService {

	constructor(
		private httpClient: HttpClient,
		private router: Router,
		private _snackBar: MatSnackBar) { }

	openSnackBar() {
		this._snackBar.open('Réunion réservée !', 'Undo', {
			duration: 3000
		});
	}

	openSnackBar2() {
		this._snackBar.open('Réunion annulée !', 'Undo', {
			duration: 3000
		});
	}

	/**On récupère les réunions en base de données. */
	getMeetings() {
		return this.httpClient.get<Meeting[]>(MEETING_PLANNER_API + 'Reunions');
	}


	/**On récupère les réunions non réservées en base de données. */
	getNotReservedMeetings() {
		return this.httpClient.get<Meeting[]>(MEETING_PLANNER_API + 'ReunionsNonReservees');
	}

	/**On récupère les réunions réservées en base de données. */
	getReservedMeetings() {
		return this.httpClient.get<Meeting[]>(MEETING_PLANNER_API + 'ReunionsReservees');
	}

	/**On sauvegarde une réunion en base de données. */
	reserveMeeting(meeting: Meeting) {
		this.httpClient.post<Meeting>(MEETING_PLANNER_API + 'Reunion', meeting)
			.subscribe({
				next: data => {
					this.openSnackBar();
					this.router.navigate(['salles-reservees']);
				}
			});
	}

	/**On modifie une réunion en base de données pour annuler la réservation. */
	cancelMeeting(meeting: Meeting) {
		this.httpClient.put<Meeting>(MEETING_PLANNER_API + 'Reunion', meeting)
			.subscribe({
				next: data => {
					this.openSnackBar2();
					this.router.navigate(['salles-reservees']);
				}
			});
	}

}