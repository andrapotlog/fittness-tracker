import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {Observable} from "rxjs";

import * as fromRoot from '../../app.reducer';
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isAuth$: Observable<boolean>;

  @Output() sidenavToggle = new EventEmitter<void>();

  constructor(private authService: AuthService,
              private store: Store<fromRoot.State>) { }

  ngOnInit(): void {
    this.isAuth$ = this.store.select(fromRoot.getIsAuth);
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onLogout() {
    this.authService.logout();
  }
}
