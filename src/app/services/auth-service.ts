import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { User } from "../models/User.model";

const AUTH_API = 'http://localhost:9099/api/auth/';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AuthService {

    constructor(
        private http: HttpClient,
        private router: Router,
        private _snackBar: MatSnackBar
    ) { }

    login(username: string, password: string): Observable<any> {
        return this.http.post(AUTH_API + 'signin', {
            username,
            password
        }, httpOptions);
    }

}