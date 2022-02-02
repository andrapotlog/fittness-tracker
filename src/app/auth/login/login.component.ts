import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import {AuthService} from "../auth.service";
import {UIService} from "../../shared/ui.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  form:FormGroup;
  isLoading = false;
  isLoadingSubs: Subscription;

  constructor(private authService: AuthService,
              private uiService: UIService) { }

  ngOnInit(): void {
    this.isLoadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    })
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

  ngOnDestroy() {
    if(this.isLoadingSubs) {
      this.isLoadingSubs.unsubscribe();
    }
  }
}
