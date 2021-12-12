import { Injectable } from "@angular/core";
import { JwtResponse } from "../models/JwtResponse.model";

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable()
export class TokenStorageService {

    constructor() { }

    /**On vide la session de tous les token. */
    signOut() {
        window.sessionStorage.clear();
    }

    /**On enrehistre le token dans la session. */
    public saveToken(token: string) {
        window.sessionStorage.removeItem(TOKEN_KEY);
        window.sessionStorage.setItem(TOKEN_KEY, token);
    }

    /**On récupère le token de la session. */
    public getToken() {
        return window.sessionStorage.getItem(TOKEN_KEY);
    }

}