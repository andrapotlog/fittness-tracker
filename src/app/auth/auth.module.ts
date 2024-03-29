import {NgModule} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";

import {SignupComponent} from "./signup/signup.component";
import {LoginComponent} from "./login/login.component";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {SharedModule} from "../shared/shared.module";
import {AuthRoutingModule} from "./auth-routing.module";

@NgModule({
  declarations: [
    SignupComponent,
    LoginComponent
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    AuthRoutingModule
  ],
  exports: []
})
export class AuthModule{}
