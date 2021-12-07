import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

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

	addUser(user: any) {
		this.httpClient.post<any>('http://localhost:9099/api/Utilisateur', user, { observe: "body", responseType: "json" })
			.subscribe({
				next: data => {
					console.log(data);
					this.openSnackBar();
					this.router.navigate(['/users']);
				}
			});
	}

	getUsers() {
		return this.httpClient.get<any>('http://localhost:9099/api/Utilisateurs');
	}

}