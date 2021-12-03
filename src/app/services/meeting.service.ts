import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Meeting } from "../models/Meeting.model";

@Injectable()
export class MeetingService {

	meetingsSubject = new Subject<any[]>();
	private meetings!: Meeting[];

	constructor(
		private httpClient: HttpClient
	) { }

	emitMeetings() {
		this.meetingsSubject.next(this.meetings.slice());
	}

	getMeetings() {
		this.httpClient.get<any>('http://localhost:9097/api/Reunions')
			.subscribe({
				next: data => {
					console.log(data);
					this.meetings = data;
					this.emitMeetings();
				}
			});
	}

	getNotReservedMeetings() {
		this.httpClient.get<any>('http://localhost:9097/api/ReunionsNonReservees')
			.subscribe({
				next: data => {
					console.log(data);
					this.meetings = data;
					this.emitMeetings();
				}
			});
	}

	getReservedMeetings() {
		this.httpClient.get<any>('http://localhost:9097/api/ReunionsReservees')
			.subscribe({
				next: data => {
					console.log(data);
					this.meetings = data;
					this.emitMeetings();
				}
			});
	}

}