import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { FreeTool } from '../models/FreeTool.model';
import { Meeting } from '../models/Meeting.model';
import { Room } from '../models/Room.model';
import { RoomTool } from '../models/RoomTool.model';
import { User } from '../models/User.model';
import { FreeToolService } from '../services/free-tool.service';
import { MeetingService } from '../services/meeting.service';
import { RoomService } from '../services/room.service';
import { UserService } from '../services/user.service';

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

  @ViewChild('matRef')
  matRef!: MatSelect;

  /**Permet de clear les options de mat-select */
  clear() {
    this.matRef.options.forEach((data: MatOption) => data.deselect());
  }

  constructor(
    private formBuilder: FormBuilder,
    private meetingService: MeetingService,
    private roomService: RoomService,
    private freeToolService: FreeToolService,
    private userService: UserService,
    private dialog: MatDialog) { }

  /** On r??cup??re les r??unions non r??serv??es ?? l'initialisation. */
  ngOnInit() {
    this.meetingService.getNotReservedMeetings().subscribe({
      next: data => {
        this.notReservedMeetings = data;
      }
    });
    this.initForm();
  }

  /**On initialise le formulaire. */
  initForm() {
    this.meetingForm = this.formBuilder.group({
      reunion: ['', Validators.required],
      salle: ['', Validators.required],
      camera: [''],
      screen: [''],
      board: [''],
      octopus: ['']
    });
  }

  /**Fen??tre de message d'erreur. */
  openDialog(element: any) {
    const dialogRef = this.dialog.open(DialogContentReserveMeeting,
      {
        data: element
      });
  }

  /**On v??rifie que la r??servation ?? tous les ??quipements n??cessaires au type de la r??union et on lui affecte un utilisateur 
   * avant de la sauvegarder.
   */
  onSubmitForm() {
    this.meetingToReserve.roomDto = this.selectedRoom;
    this.meetingToReserve.freeToolDtos.push(...this.ecrans.filter(x => x.freeToolId === this.meetingForm.value['screen']));
    this.meetingToReserve.freeToolDtos.push(...this.webcams.filter(x => x.freeToolId === this.meetingForm.value['camera']));
    this.meetingToReserve.freeToolDtos.push(...this.tableaux.filter(x => x.freeToolId === this.meetingForm.value['board']));
    this.meetingToReserve.freeToolDtos.push(...this.pieuvres.filter(x => x.freeToolId === this.meetingForm.value['octopus']));
    if (this.checkEnoughRoomAndOrFreeToolsForMeeting(this.meetingToReserve)) {
      this.meetingToReserve.isReserved = true;
      this.userService.getUserByEmail(window.sessionStorage.getItem('email'))
        .subscribe({
          next: (data: User) => {
            this.meetingToReserve.userDto = data;
            this.meetingService.reserveMeeting(this.meetingToReserve);
          }
        });
    } else {
      this.openDialog('');
    }
  }

  /**On r??cup??re les salles compatibles avec l'heure de la r??union et au nombre de personnes convi??es. */
  getRoomsCompatibleForSelectedMeeting(numberOfPersons: number, meetingStartHour: number) {
    this.roomService.getRoomsCompatibleForMeeting(numberOfPersons, meetingStartHour)
      .subscribe({
        next: data => {
          this.roomsForSelectedMeeting = data;
        }
      });
  }

  /**Fonction des actions ?? la s??lection de la r??union. */
  selectedReunion(event: MatSelectChange) {
    this.roomsForSelectedMeeting = [];
    this.clear();
    this.resetTools();
    this.notReservedMeetings.forEach((meetingToReserve: Meeting) => {
      if (meetingToReserve.id == event.value) {
        this.meetingToReserve = meetingToReserve;
      }
    });
    this.getRoomsCompatibleForSelectedMeeting(this.meetingToReserve.numberOfPersons, this.meetingToReserve.startHour);
  }

  /**Fonction des actions ?? la s??lection de la salle. */
  selectedSalle(event: MatSelectChange) {
    this.resetTools();
    this.roomsForSelectedMeeting.forEach((selectedRoom: Room) => {
      if (selectedRoom.id == event.value) {
        this.selectedRoom = selectedRoom;
        this.selectedRoomRoomTools = selectedRoom.roomToolDtos;
      }
    });
    this.findMissingToolsInRoom(this.meetingToReserve.type, this.selectedRoomRoomTools);
    this.findFreeToolsForMeeting();
  }

  /**Permet de trouver les ??quipements manquant ?? une r??union apr??s s??lection de la salle. */
  findMissingToolsInRoom(meetingType: String, roomTools: RoomTool[]) {
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

  /**R??cup??re des ??quipements libres en base de donn??es qui sont n??cessaires au type de la r??union en prenant
   * en compte les ??quipements de la salle d??j?? pr??sents.
   */
  findFreeToolsForMeeting() {
    this.missingToolTypesInRoom.forEach((freeToolType: string) => {
      this.freeToolService.getFreeToolsByTypeCompatibleForMeeting(freeToolType, this.meetingToReserve.startHour)
        .subscribe({
          next: data => {
            switch (freeToolType) {
              case 'Pieuvre':
                this.pieuvres = data;
                break;
              case 'Ecran':
                this.ecrans = data;
                break;
              case 'Tableau':
                this.tableaux = data;
                break;
              case 'Webcam':
                this.webcams = data;
                break;
            }
          }
        })
    });
  }

  /**V??rifie qu'il y a assez q'??quipements au type de la r??union, peu importe qu'ils soient libres ou d??j?? pr??sents
   * dans la salle au d??part.
   */
  checkEnoughRoomAndOrFreeToolsForMeeting(meeting: Meeting) {
    let result = true;
    this.neededToolsInRoom.forEach(
      (toolType: string) => {
        switch (toolType) {
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

  /**R??initialise la liste des ??quipements affich??s. */
  resetTools() {
    this.ecrans = [];
    this.pieuvres = [];
    this.tableaux = [];
    this.webcams = [];
    this.presentToolTypesInRoom = [];
    this.neededToolsInRoom = [];
    this.missingToolTypesInRoom = [];
  }

}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-content-example-dialog.html',
})
export class DialogContentReserveMeeting {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

}