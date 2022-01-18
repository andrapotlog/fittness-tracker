import {Subject} from "rxjs";
import {Injectable} from "@angular/core";

import {User} from "./user.module";
import {AuthData} from "./auth-data.module";
import {Router} from "@angular/router";

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private user: User;

  constructor(private router: Router) {
  }

  registerUser(authData: AuthData) {
    this.user = {
      email: authData.email,
      userID: Math.round(Math.random() * 10000).toString()
    };
    this.authSuccsessfully()
  }

  login(authData: AuthData) {
    this.user = {
      email: authData.email,
      userID: Math.round(Math.random() * 10000).toString()
    }
    this.authSuccsessfully()
  }

  logout() {
    this.user = {} as User;
    this.authChange.next(false);
    this.router.navigate(['/login']);
  }

  getUser() {
    return {...this.user};
  }

  isAuth() {
    return this.user != null;
  }

  private authSuccsessfully() {
    this.authChange.next(true);
    this.router.navigate(['/training']);
  }


}
