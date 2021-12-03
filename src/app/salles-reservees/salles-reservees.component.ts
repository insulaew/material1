import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Meeting } from '../models/Meeting.model';
import { RoomTool } from '../models/RoomTool.model';
import { MeetingService } from '../services/meeting.service';

@Component({
  selector: 'app-salles-reservees',
  templateUrl: './salles-reservees.component.html',
  styleUrls: ['./salles-reservees.component.css']
})
export class SallesReserveesComponent implements OnInit {

  displayedColumns: string[] = ['id', 'startHour', 'type', 'roomDto', 'numberOfPersons', 'reserved', 'userDto'];

  meetings!: Meeting[];
  meetingSubscription!: Subscription;
  
  constructor(
    private dialog: MatDialog,
    private meetingService: MeetingService
  ) { }

  ngOnInit() {
    this.meetingService.getReservedMeetings();
    this.meetingSubscription = this.meetingService.meetingsSubject.subscribe(
      (meetings: Meeting[]) => {
        this.meetings = meetings;
      }
    );
  }

  openDialog(element: Meeting) {
    const dialogRef = this.dialog.open(DialogContentExampleDialog,
      {
        data: element
      });
  }

}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-content-example-dialog.html',
})

export class DialogContentExampleDialog implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Meeting) { }

  tools!: string[];
  user = this.data.userDto;
  room = this.data.roomDto;
  roomTools = JSON.stringify(this.data.roomDto.roomToolDtos);

  ngOnInit() {

    switch (this.data.type) {
      case 'VC': {
        this.tools = ['Pieuvre', 'Ecran', 'Webcam'];
        break;
      }
      case 'SPEC': {
        this.tools = ['Tableau'];
        break;
      }
      case 'RS': {
        this.tools = [''];
        break;
      }
      case 'RC': {
        this.tools = ['Tableau', 'Ecran', 'Pieuvre'];
        break;
      }
    }
  }
}
