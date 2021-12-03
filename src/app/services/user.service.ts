import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject } from "rxjs";
import { User } from "../models/User.model";

@Injectable()
export class UserService {

	usersSubject = new Subject<any[]>();
	errorMessage!: any;
	private users!: User[];

	constructor(
		private httpClient: HttpClient,
		private router: Router,
		private _snackBar: MatSnackBar) { }

	openSnackBar() {
		this._snackBar.open('Compte utilisateur créé !', 'Undo', {
			duration: 3000
		});
	}

	emitUsers() {
		this.usersSubject.next(this.users.slice());
	}

	addUser(user: any) {
		this.httpClient.post<any>('http://localhost:9097/api/Utilisateur', user)
			.subscribe({
				next: data => {
					console.log(data);
					this.openSnackBar();
					this.router.navigate(['/users']);
				},
				error: error => {
					this.errorMessage = error;
					console.log(error);
				}
			});
	}

	getUsers() {
		this.httpClient.get<any>('http://localhost:9097/api/Utilisateurs')
			.subscribe({
				next: data => {
					console.log(data);
					this.users = data;
					this.emitUsers();
				},
				error: error => {
					this.errorMessage = error;
					console.log(error);
				}
			});
	}

}