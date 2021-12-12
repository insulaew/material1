import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { FreeTool } from '../models/FreeTool.model';
import { Meeting } from '../models/Meeting.model';
import { Room } from '../models/Room.model';
import { RoomTool } from '../models/RoomTool.model';
import { User } from '../models/User.model';
import { FreeToolService } from '../services/free-tool.service';
import { MeetingService } from '../services/meeting.service';
import { RoomService } from '../services/room.service';

export interface ToolsForTypeMeeting {
  VC: string[],
  SPEC: string[],
  RS: string[],
  RC: string[],
}

const ToolsForEachType: ToolsForTypeMeeting =
{
  VC: ['Pieuvre', 'Ecran', 'Webcam'],
  SPEC: ['Tableau'],
  RS: [''],
  RC: ['Tableau', 'Ecran', 'Pieuvre']
}


@Component({
  selector: 'app-reserver-salle',
  templateUrl: './reserver-salle.component.html',
  styleUrls: ['./reserver-salle.component.css']
})
export class ReserverSalleComponent implements OnInit {

  meetingForm!: FormGroup;
  notReservedMeetings!: Meeting[];
  meetingToReserve!: Meeting;
  roomsForSelectedMeeting!: Room[];
  selectedRoom!: Room;
  selectedRoomRoomTools!: RoomTool[];
  missingToolTypesInRoom!: string[];
  presentToolTypesInRoom!: string[];
  neededToolsInRoom!: string[];
  ecrans!: FreeTool[];
  pieuvres!: FreeTool[];
  tableaux!: FreeTool[];
  webcams!: FreeTool[];


  constructor(
    private formBuilder: FormBuilder,
    private meetingService: MeetingService,
    private roomService: RoomService,
    private freeToolService: FreeToolService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.meetingService.getNotReservedMeetings().subscribe({
      next: data => {
        this.notReservedMeetings = data;
      }
    });
    this.initForm();
  }

  initForm() {
    console.log(window.sessionStorage.getItem('auth-user'))
    this.meetingForm = this.formBuilder.group({
      reunion: ['', Validators.required],
      salle: ['', Validators.required],
      camera: [''],
      screen: [''],
      board: [''],
      octopus: ['']

    });
  }

  openDialog(element: any) {
    const dialogRef = this.dialog.open(DialogContentReserveMeeting,
      {
        data: element
      });
  }


  onSubmitForm() {
    this.meetingToReserve.freeToolDtos = [];
    console.log(this.meetingForm.value)
    this.meetingToReserve.roomDto = this.selectedRoom;
    this.meetingToReserve.freeToolDtos.push(...this.ecrans.filter(x => x.freeToolId === this.meetingForm.value['screen']));
    this.meetingToReserve.freeToolDtos.push(...this.webcams.filter(x => x.freeToolId === this.meetingForm.value['camera']));
    this.meetingToReserve.freeToolDtos.push(...this.tableaux.filter(x => x.freeToolId === this.meetingForm.value['board']));
    this.meetingToReserve.freeToolDtos.push(...this.pieuvres.filter(x => x.freeToolId === this.meetingForm.value['octopus']));
    console.log(JSON.stringify(this.meetingToReserve));
    console.log(this.checkEnoughRoomAndOrFreeToolsForMeeting(this.meetingToReserve))
    console.log(this.neededToolsInRoom)
    if(this.checkEnoughRoomAndOrFreeToolsForMeeting(this.meetingToReserve)) {
      this.meetingToReserve.isReserved = true;
      this.meetingToReserve.userDto = new User(1, 'Nicolas', 'Sivignon', 'media.svd@outlook.fr', 'sudoku13', [1]);
      console.log(this.meetingToReserve.isReserved)
      console.log(JSON.stringify(this.meetingToReserve))
      this.meetingService.reserveMeeting(this.meetingToReserve);
    } else {
      this.openDialog('');
    }
  }

  getRoomsCompatibleForSelectedMeeting(numberOfPersons: number, meetingStartHour: number) {
    this.roomService.getRoomsCompatibleForMeeting(numberOfPersons, meetingStartHour)
    .subscribe({
      next: data => {
        //console.log(data.length)
        if (data.length == 0) {
          this.roomService.getRoomsCompatibleForMeetingEmergency(numberOfPersons, meetingStartHour)
          .subscribe({
            next: data2 => {
              //console.log(data2)
              this.roomsForSelectedMeeting = data2;
            }
          });
        } else {
          this.roomsForSelectedMeeting = data;
        }
      }
    });
  }

  selectedReunion(event: MatSelectChange) {
    this.ecrans = [];
    this.pieuvres = [];
    this.tableaux = [];
    this.webcams = [];
    this.presentToolTypesInRoom = [];
    this.neededToolsInRoom = [];
    this.missingToolTypesInRoom = [];
    this.notReservedMeetings.forEach((meetingToReserve: Meeting) => {
      if (meetingToReserve.id == event.value) {
        this.meetingToReserve = meetingToReserve;
      }
    });
    this.getRoomsCompatibleForSelectedMeeting(this.meetingToReserve.numberOfPersons, this.meetingToReserve.startHour);
  }

  selectedSalle(event: MatSelectChange) {
    this.ecrans = [];
    this.pieuvres = [];
    this.tableaux = [];
    this.webcams = [];
    this.roomsForSelectedMeeting.forEach((selectedRoom: Room) => {
      if (selectedRoom.id == event.value) {
        this.selectedRoom = selectedRoom;
        this.selectedRoomRoomTools = selectedRoom.roomToolDtos;
      }
    });
    this.findMissingToolsInRoom(this.meetingToReserve.type, this.selectedRoomRoomTools);
    this.findFreeToolsForMeeting();
  }

  findMissingToolsInRoom(meetingType: String, roomTools: RoomTool[]) {
    this.presentToolTypesInRoom = [];
    this.missingToolTypesInRoom = [];
    this.neededToolsInRoom = [];
    roomTools.forEach((roomTool: RoomTool) => {
      switch (roomTool.type) {
        case 'Pieuvre':
          this.presentToolTypesInRoom.push('Pieuvre');
          break;
        case 'Ecran':
          this.presentToolTypesInRoom.push('Ecran');
          break;
        case 'Webcam':
          this.presentToolTypesInRoom.push('Webcam');
          break;
        case 'Tableau':
          this.presentToolTypesInRoom.push('Tableau');
          break;
      }
    });

    switch (meetingType) {
      case 'VC':
        this.missingToolTypesInRoom = ToolsForEachType.VC.filter(item => !this.presentToolTypesInRoom.includes(item));
        this.neededToolsInRoom = ToolsForEachType.VC;
        break;
      case 'SPEC':
        this.missingToolTypesInRoom = ToolsForEachType.SPEC.filter(item => !this.presentToolTypesInRoom.includes(item));
        this.neededToolsInRoom = ToolsForEachType.SPEC;
        break;
      case 'RS':
        this.missingToolTypesInRoom = ToolsForEachType.RS.filter(item => !this.presentToolTypesInRoom.includes(item));
        this.neededToolsInRoom = ToolsForEachType.RS;
        break;
      case 'RC':
        this.missingToolTypesInRoom = ToolsForEachType.RC.filter(item => !this.presentToolTypesInRoom.includes(item));
        this.neededToolsInRoom = ToolsForEachType.RC;
        break;
    }
  }

  findFreeToolsForMeeting () {
    this.missingToolTypesInRoom.forEach((freeToolType: string) => {
      this.freeToolService.getFreeToolsByTypeCompatibleForMeeting(freeToolType, this.meetingToReserve.startHour)
      .subscribe({
        next: data => {
          switch(freeToolType) {
            case 'Pieuvre':
              this.pieuvres = data;
              console.log(JSON.stringify(this.pieuvres))
              break;
            case 'Ecran':
              this.ecrans = data;
              console.log(JSON.stringify(this.ecrans))
              break;
            case 'Tableau':
              this.tableaux = data;
              console.log(JSON.stringify(this.tableaux))
              break;
            case 'Webcam':
              this.webcams = data;
              console.log(JSON.stringify(this.webcams))
              break;
          }
        }
      })
    });
  }

  checkEnoughRoomAndOrFreeToolsForMeeting(meeting: Meeting) {
    let result = true;
    this.neededToolsInRoom.forEach(
      (toolType: string) => {
        switch(toolType) {
          case 'Pieuvre':
            if (meeting.freeToolDtos.filter(x => x.type === 'Pieuvre').length == 0 && this.presentToolTypesInRoom.filter(x => x === 'Pieuvre').length == 0) {
              result = false;
            }
            break;
          case 'Ecran':
            if (meeting.freeToolDtos.filter(x => x.type === 'Ecran').length == 0 && this.presentToolTypesInRoom.filter(x => x === 'Ecran').length == 0) {
              result = false;
            }
            break;
          case 'Tableau':
            if (meeting.freeToolDtos.filter(x => x.type === 'Tableau').length == 0 && this.presentToolTypesInRoom.filter(x => x === 'Tableau').length == 0) {
              result = false;
            }
            break;
          case 'Webcam':
            if (meeting.freeToolDtos.filter(x => x.type === 'Webcam').length == 0 && this.presentToolTypesInRoom.filter(x => x === 'Webcam').length == 0) {
              result = false;
            }
            break;
        }
      }
    );

    return result;
  }

}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-content-example-dialog.html',
})
export class DialogContentReserveMeeting {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

}