import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/User.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {

  userForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.userForm = this.formBuilder.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
      }
    );
  }

  onSubmitForm() {
    const formValue = this.userForm.value;
    const newUser = new User(
      null,
      formValue['firstName'],
      formValue['lastName'],
      formValue['email'],
      formValue['password'],
      []
    );
    console.log(JSON.stringify(newUser));
    this.userService.addUser(newUser);
  }

}
