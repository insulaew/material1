import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../models/User.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit, OnDestroy {

  users!: User[];
  userSubscription!: Subscription;
  
  constructor(private userService: UserService) { }
  
  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  ngOnInit() {
    this.userService.getUsers();
    this.userSubscription = this.userService.usersSubject.subscribe(
      (users: User[]) => {
        this.users = users;
      }
    );
  }

  displayedColumns: string[] = ['firstName', 'lastName', 'email'];

  doNothing() {
    
  }

}
