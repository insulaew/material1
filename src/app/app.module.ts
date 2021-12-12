import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from "@angular/flex-layout";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { RouterModule, Routes } from '@angular/router';
import { NewUserComponent } from './new-user/new-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersListComponent } from './users-list/users-list.component';
import { UserService } from './services/user.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MeetingService } from './services/meeting.service';
import { HttpErrorInterceptor } from './interceptors/http-error-interceptor';
import { SallesReserveesComponent } from './salles-reservees/salles-reservees.component';
import { SallesNonReserveesComponent } from './salles-non-reservees/salles-non-reservees.component';
import { ReserverSalleComponent } from './reserver-salle/reserver-salle.component';
import { RoomService } from './services/room.service';
import { FreeToolService } from './services/free-tool.service';
import { LoginComponent } from './login/login.component';
import { AuthService } from './services/auth-service';
import { AnnulerReservationComponent } from './annuler-reservation/annuler-reservation.component';
import { TokenStorageService } from './services/token-storage.service';
import { AuthGuard } from './services/auth-guard.service';

const appRoutes: Routes = [
  { path: '', component: SallesNonReserveesComponent },
  { path: 'salles-non-reservees', component: SallesNonReserveesComponent },
  { path: 'reserver-salle', canActivate: [AuthGuard], component: ReserverSalleComponent },
  { path: 'salles-reservees', component: SallesReserveesComponent },
  { path: 'new-user', component: NewUserComponent },
  { path: 'users', component: UsersListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'annuler-reservation', canActivate: [AuthGuard], component: AnnulerReservationComponent },
]
@NgModule({
  declarations: [
    AppComponent,
    SallesNonReserveesComponent,
    NewUserComponent,
    UsersListComponent,
    SallesReserveesComponent,
    ReserverSalleComponent,
    LoginComponent,
    AnnulerReservationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [UserService, MeetingService, RoomService, FreeToolService, AuthService, TokenStorageService, AuthGuard, {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpErrorInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent],
})
export class AppModule { }
