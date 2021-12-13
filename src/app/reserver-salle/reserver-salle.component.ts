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

  /** On récupère les réunions non réservées à l'initialisation. */
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

  /**Fenêtre de message d'erreur. */
  openDialog(element: any) {
    const dialogRef = this.dialog.open(DialogContentReserveMeeting,
      {
        data: element
      });
  }

  /**On vérifie que la réservation à tous les équipements nécessaires au type de la réunion et on lui affecte un utilisateur 
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

  /**On récupère les salles compatibles avec l'heure de la réunion et au nombre de personnes conviées. */
  getRoomsCompatibleForSelectedMeeting(numberOfPersons: number, meetingStartHour: number) {
    this.roomService.getRoomsCompatibleForMeeting(numberOfPersons, meetingStartHour)
      .subscribe({
        next: data => {
          this.roomsForSelectedMeeting = data;
        }
      });
  }

  /**Fonction des actions à la sélection de la réunion. */
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

  /**Fonction des actions à la sélection de la salle. */
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

  /**Permet de trouver les équipements manquant à une réunion après sélection de la salle. */
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

  /**Récupère des équipements libres en base de données qui sont nécessaires au type de la réunion en prenant
   * en compte les équipements de la salle déjà présents.
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

  /**Vérifie qu'il y a assez q'équipements au type de la réunion, peu importe qu'ils soient libres ou déjà présents
   * dans la salle au départ.
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

  /**Réinitialise la liste des équipements affichés. */
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