import {Injectable} from "@angular/core";

import {AuthData} from "./auth-data.module";
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {TrainingService} from "../training/training.service";
import {UIService} from "../shared/ui.service";
import {Store} from "@ngrx/store";

import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions'
import * as Auth from './auth.actions';

@Injectable()
export class AuthService {
  constructor(private router: Router,
              private auth: AngularFireAuth,
              private trainingService: TrainingService,
              private uiService: UIService,
              private store: Store<fromRoot.State>) {
  }

  initAuthListener() {
    this.auth.authState.subscribe(user => {
      if(user) {
        this.store.dispatch(new Auth.SetAuth());
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubs();
        this.store.dispatch(new Auth.SetUnauth());
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    this.auth.createUserWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        this.store.dispatch(new UI.StopLoading());
    })
      .catch(error => {
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar(error.message, null, 3000);
      });
  }

  login(authData: AuthData) {
    //this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());
    this.auth.signInWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        this.store.dispatch(new UI.StopLoading());
      })
      .catch(error => {
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar(error.message, null, 3000);
      });
  }

  logout() {
    this.auth.signOut();
  }
}
