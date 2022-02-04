import {ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import * as fromRoot from '../app.reducer';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private router: Router,
              private store: Store<fromRoot.State>) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.store.select(fromRoot.getIsAuth);
  }

  canLoad(route: Route): any {
    return this.store.select(fromRoot.getIsAuth);
  }
}
