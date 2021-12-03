import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToolService } from '../services/tool.service';

export interface Meeting {
  hour: number;
  idReunion: number;
  type: string;
  nombrePersonnes: number;
  meetingOwner: string;
  room: string;
}

const ELEMENT_DATA: Meeting[] = [
  {hour: 9, idReunion: 1, type: 'VC', nombrePersonnes: 8, meetingOwner: 'Nicolas SIVIGNON', room: 'E1001'},
  {hour: 11, idReunion: 2, type: 'RC', nombrePersonnes: 6, meetingOwner: 'Nicolas SIVIGNON', room: 'E1002'},
  {hour: 13, idReunion: 3, type: 'RS', nombrePersonnes: 4, meetingOwner: 'Nicolas SIVIGNON', room: 'E1003'},
  {hour: 15, idReunion: 4, type: 'VC', nombrePersonnes: 2, meetingOwner: 'Nicolas SIVIGNON', room: 'E1004'},
  {hour: 17, idReunion: 5, type: 'VC', nombrePersonnes: 23, meetingOwner: 'Nicolas SIVIGNON', room: 'E1005'},
  {hour: 19, idReunion: 6, type: 'SPEC', nombrePersonnes: 18, meetingOwner: 'Nicolas SIVIGNON', room: 'E1006'},
];

@Component({
  selector: 'app-tools-view',
  templateUrl: './tools-view.component.html',
  styleUrls: ['./tools-view.component.css']
})
export class ToolsViewComponent implements OnInit, OnDestroy {

  isAuth = false;
  tools!: any[];
  toolSubscription!: Subscription;

  displayedColumns: string[] = ['hour', 'idReunion', 'type', 'nombrePersonnes', 'meetingOwner', 'room'];
  dataSource = ELEMENT_DATA;
  clickedRows = new Set<Meeting>();

  lastUpdate = new Promise((resolve) => {
    const date = new Date();
    setTimeout(
      () => {
        resolve(date);
      }, 2000
    );
  });

  constructor(private toolService: ToolService) {
    setTimeout(() => {
      this.isAuth = true;
    }, 4000);
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    
  }

}
