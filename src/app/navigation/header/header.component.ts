import {Component, OnInit, EventEmitter, Output, OnDestroy} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuth = false;
  authSubscription : Subscription;

  @Output() sidenavToggle = new EventEmitter<void>();

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authSubscription = this.authService.authChange.subscribe(authStatus => {
        this.isAuth = authStatus;
      }
    )
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
