import {Component, OnInit, EventEmitter, Output, OnDestroy} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {Subscription} from "rxjs";


@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit, OnDestroy {
  isAuth = false;
  authSubscription : Subscription;

  @Output() closeSidenav = new EventEmitter<void>();

  constructor(private authService : AuthService) { }

  ngOnInit(): void {
    this.authSubscription = this.authService.authChange.subscribe(authValue => {
      this.isAuth = authValue;
    })
  }

  onClose() {
    this.closeSidenav.emit();
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
