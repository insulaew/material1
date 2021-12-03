import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { FreeTool } from '../models/FreeTool.model';
import { Meeting } from '../models/Meeting.model';
import { Room } from '../models/Room.model';
import { RoomTool } from '../models/RoomTool.model';
import { User } from '../models/User.model';
import { MeetingService } from '../services/meeting.service';

export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  displayedColumns: string[] = ['id', 'startHour', 'type', 'numberOfPersons', 'reserved'];

  meetings!: Meeting[];
  meetingSubscription!: Subscription;
  
  constructor(
    private dialog: MatDialog,
    private meetingService: MeetingService
    ) { }

  ngOnInit() {
    this.meetingService.getMeetings();
    this.meetingSubscription = this.meetingService.meetingsSubject.subscribe(
      (meetings: Meeting[]) => {
        this.meetings = meetings;
      }
    );
  }

  openDialog(element: any) {
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
export class DialogContentExampleDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  user: User|null = this.data.userDto;
  room: Room|null = this.data.roomDto;
  freeTools: FreeTool[] = this.data.freeToolDtos;
  roomTools!: RoomTool[];
}
