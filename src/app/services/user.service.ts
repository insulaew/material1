import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from '../models/User.model';

const MEETING_PLANNER_API = 'http://localhost:9099/api/';

@Injectable()
export class UserService {

	constructor(
		private httpClient: HttpClient,
		private router: Router,
		private _snackBar: MatSnackBar) { }

	openSnackBar() {
		this._snackBar.open('Compte utilisateur créé !', 'Undo', {
			duration: 3000
		});
	}

	/**On sauvegarde un nouvel utilisateur en base de données. */
	addUser(user: User) {
		this.httpClient.post<User>(MEETING_PLANNER_API + 'Utilisateur', user)
			.subscribe({
				next: data => {
					this.openSnackBar();
					this.router.navigate(['/users']);
				}
			});
	}

	/**On récupère tous les utilisateurs en base de données. */
	getUsers() {
		return this.httpClient.get<any>(MEETING_PLANNER_API + 'Utilisateurs');
	}

}