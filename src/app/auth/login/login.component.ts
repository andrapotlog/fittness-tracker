import {Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {AuthService} from "../auth.service";
import {UIService} from "../../shared/ui.service";
import {Observable} from "rxjs";
import {Store} from "@ngrx/store";
import 'rxjs-compat/add/operator/map'

import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form:FormGroup;
  isLoading$: Observable<boolean>;

  constructor(private authService: AuthService,
              private uiService: UIService,
              private store: Store<fromRoot.State>) { }

  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
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
