import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {Observable} from "rxjs";

import * as fromRoot from '../../app.reducer';
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {
  isAuth$: Observable<boolean>;

  @Output() closeSidenav = new EventEmitter<void>();

  constructor(private authService : AuthService,
              private store: Store<fromRoot.State>) { }

  ngOnInit(): void {
    this.isAuth$ = this.store.select(fromRoot.getIsAuth);
  }

  onClose() {
    this.closeSidenav.emit();
  }

  onLogout() {
    this.authService.logout();
    this.onClose();
  }
}
