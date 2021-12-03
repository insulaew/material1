import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Meeting } from "../models/Meeting.model";

@Injectable()
export class MeetingService {

    meetingsSubject = new Subject<any[]>();
	errorMessage!: any;
	private meetings!: Meeting[];

    constructor(
        private httpClient: HttpClient,
    ) {}

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
				},
				error: error => {
					this.errorMessage = error;
					console.log(error);
				}
			});
	}

}