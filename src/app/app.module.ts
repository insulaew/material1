import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FlexLayoutModule} from "@angular/flex-layout";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { ToolsViewComponent } from './tools-view/tools-view.component';
import { RouterModule, Routes } from '@angular/router';
import { TestComponent } from './test/test.component';
import { NewUserComponent } from './new-user/new-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersListComponent } from './users-list/users-list.component';
import { UserService } from './services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { MeetingService } from './services/meeting.service';

const appRoutes: Routes = [
  { path: 'test', component: TestComponent },
  { path: 'new-user', component: NewUserComponent },
  { path: 'users', component: UsersListComponent },
]
@NgModule({
  declarations: [
    AppComponent,
    ToolsViewComponent,
    TestComponent,
    NewUserComponent,
    UsersListComponent
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
  providers: [UserService, MeetingService],
  bootstrap: [AppComponent],
})
export class AppModule { }
