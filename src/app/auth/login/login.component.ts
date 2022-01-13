import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form:FormGroup;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      "email": new FormControl("", [Validators.required, Validators.email]),
      "password": new FormControl("", Validators.required)
    });
  }

  onSubmit() {
    this.authService.login({
      email: this.form.value.email,
      password: this.form.value.password
    });
  }
}
