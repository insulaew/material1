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
import { SallesNonReserveesComponent } from './test/salles-non-reservees.component';
import { ReserverSalleComponent } from './reserver-salle/reserver-salle.component';
import { RoomService } from './services/room.service';
import { FreeToolService } from './services/free-tool.service';

const appRoutes: Routes = [
  { path: '', component: SallesNonReserveesComponent },
  { path: 'salles-non-reservees', component: SallesNonReserveesComponent },
  { path: 'reserver-salle', component: ReserverSalleComponent },
  { path: 'salles-reservees', component: SallesReserveesComponent },
  { path: 'new-user', component: NewUserComponent },
  { path: 'users', component: UsersListComponent },
]
@NgModule({
  declarations: [
    AppComponent,
    SallesNonReserveesComponent,
    NewUserComponent,
    UsersListComponent,
    SallesReserveesComponent,
    ReserverSalleComponent
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
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [UserService, MeetingService, RoomService, FreeToolService, {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpErrorInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent],
})
export class AppModule { }
