import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from './services/auth-service';
import { TokenStorageService } from './services/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'MEETING-PLANNER APPLICATION';

  constructor(
    private tokenStorageService: TokenStorageService,
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar) { }

  openSnackBar() {
    this._snackBar.open('Vous êtes maintenant déconnecté. Vous ne pouvez plus réserver ni annuler de réunion.', 'Undo', {
      duration: 3000
    });
  }

  /** Méthode pour se déconnecter. On vide la session des tokens et on affecte false à un boolean d'authentification. */
  logout() {
    this.authService.isAuth = false;
    this.tokenStorageService.signOut();
    return new Promise(
      (resolve, reject) => {
        setTimeout(
          () => {
            this.openSnackBar();
            /** On redirige vers la page de Login au bout d'1 seconde. */
            this.router.navigate(['login']);
            resolve(true);
          }, 1000
        );
      }
    )
  }

}
