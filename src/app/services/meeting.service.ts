import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { Meeting } from "../models/Meeting.model";

@Injectable()
export class MeetingService {

	constructor(
		private httpClient: HttpClient,
		private router: Router,
		private _snackBar: MatSnackBar
	) { }

	openSnackBar() {
		this._snackBar.open('Réunion réservée !', 'Undo', {
			duration: 3000
		});
	}

	getMeetings() {
		return this.httpClient.get<Meeting[]>('http://localhost:9099/api/Reunions');
	}


	getNotReservedMeetings() {
		return this.httpClient.get<any>('http://localhost:9099/api/ReunionsNonReservees');
	}

	getReservedMeetings() {
		return this.httpClient.get<any>('http://localhost:9099/api/ReunionsReservees');
	}

	reserveMeeting(meeting: Meeting) {
		this.httpClient.post<any>('http://localhost:9099/api/Reunion', meeting, { observe: "body", responseType: "json" })
			.subscribe({
				next: data => {
					console.log(data);
					this.openSnackBar();
					this.router.navigate(['salles-reservees']);
				}
			});
	}

}