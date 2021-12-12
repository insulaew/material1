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

    /**On enregistre l'utilisateur dans la session. */
    public saveUser(user: JwtResponse) {
        window.sessionStorage.removeItem(USER_KEY);
        window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    /**On récupère l'utilisateur dans la session. */
    public getUser() {
        const user = window.sessionStorage.getItem(USER_KEY);
        if (user) {
            return JSON.parse(user);
        }

        return {};
    }

}