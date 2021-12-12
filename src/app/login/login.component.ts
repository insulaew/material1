import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { JwtResponse } from '../models/JwtResponse.model';
import { AuthService } from '../services/auth-service';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
      }
    );
  }

  openSnackBar() {
    this._snackBar.open('Authentification réussie ! Vous êtes maintenant connecté.', 'Undo', {
      duration: 3000
    });
  }

  /**On s'identifie pour se connecter et on enregistre le token et l'user dans la session. */
  onSubmitForm() {
    const formValue = this.loginForm.value;
    this.authService.login(formValue['email'], formValue['password'])
      .subscribe({
        next: (data: JwtResponse) => {
          window.sessionStorage.setItem('email', formValue['email']);
          this.tokenStorage.saveToken(data.token);
          this.authService.isAuth = true;
          this.openSnackBar();
          this.router.navigate(['']);
        },
        error: err => {
          this.errorMessage = err.error.message;
        }
      });
  }

}
