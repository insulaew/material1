import { Component, Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AuthService } from "./auth-service";

@Injectable()
export class AuthGuard {

  constructor(
    private authService: AuthService,
    private dialog: MatDialog) { }

  /**On vérifie si l'on est bien connecté ou non. */
  canActivate() {
    if (this.authService.isAuth) {
      return true;
    } else {
      this.openDialog();
      return false;
    }
  }

  openDialog() {
    this.dialog.open(DialogContentForbidden,
      {
        data: () => { }
      });
  }

}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-content-example-dialog.html',
})
export class DialogContentForbidden {
  constructor() { }

}