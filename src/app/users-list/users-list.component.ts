import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../models/User.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  users!: User[];
  displayedColumns: string[] = ['firstName', 'lastName', 'email'];
  
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getUsers()
    .subscribe({
      next: data => {
        this.users = data;
      }
    });
  }

  doNothing() {}

}
