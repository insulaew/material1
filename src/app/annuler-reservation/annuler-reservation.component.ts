import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Meeting } from '../models/Meeting.model';
import { MeetingService } from '../services/meeting.service';

@Component({
  selector: 'app-annuler-reservation',
  templateUrl: './annuler-reservation.component.html',
  styleUrls: ['./annuler-reservation.component.css']
})
export class AnnulerReservationComponent implements OnInit {

  meetingForm!: FormGroup;
  meetingToCancel!: Meeting;
  reservedMeetings!: Meeting[];
  
  constructor(
    private formBuilder: FormBuilder,
    private meetingService: MeetingService) { }

  ngOnInit(): void {
    this.meetingService.getReservedMeetings().subscribe({
      next: data => {
        this.reservedMeetings = data;
      }
    });
    this.initForm();
  }

  initForm() {
    this.meetingForm = this.formBuilder.group({
      reunion: ['', Validators.required]
    });
  }

  /**On modifie la réunion en base de données pour annuler la réservation. */
  onSubmitForm() {
    this.meetingToCancel.freeToolDtos = [];
    this.meetingToCancel.isReserved = false;
    this.meetingService.cancelMeeting(this.meetingToCancel);
  }

  /**On récupère les réunions réservées en base de données. */
  selectedReunion(event: MatSelectChange) {
    this.reservedMeetings.forEach((meetingToCancel: Meeting) => {
      if (meetingToCancel.id == event.value) {
        this.meetingToCancel = meetingToCancel;
      }
    });
  }

}
