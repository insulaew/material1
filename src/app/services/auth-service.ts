import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JwtResponse } from "../models/JwtResponse.model";

const AUTH_API = 'http://localhost:9099/api/';

@Injectable()
export class AuthService {

    isAuth: boolean = false;

    constructor(
        private http: HttpClient) { }

    /**On s'authentifie auprès du client. */
    login(username: string, password: string) {
        return this.http.post<JwtResponse>(AUTH_API + 'Connexion', {
            username,
            password
        });
    }

}