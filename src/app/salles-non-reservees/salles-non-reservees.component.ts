import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Meeting } from '../models/Meeting.model';
import { MeetingService } from '../services/meeting.service';

@Component({
  selector: 'app-salles-non-reservees',
  templateUrl: './salles-non-reservees.component.html',
  styleUrls: ['./salles-non-reservees.component.css']
})
export class SallesNonReserveesComponent implements OnInit {

  displayedColumns: string[] = ['id', 'startHour', 'type', 'numberOfPersons', 'isReserved'];

  meetings!: Meeting[];

  constructor(
    private dialog: MatDialog,
    private meetingService: MeetingService) { }

  /**On récupère les réunions non réséervées en base de données et on les trie par ids croissants. */
  ngOnInit() {
    this.meetingService.getNotReservedMeetings().subscribe({
      next: data => {
        this.meetings = data;
        this.meetings.sort((x, y) => (x.id < y.id) ? -1 : 1);
      }
    });
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

