import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { RouterStateSnapshot } from '@angular/router/src/router_state';
import { AuthService } from './auth/auth.service';

@Injectable()
export class HomeGuardService implements CanActivate {

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {

    if (this.auth.getToken) {
      this.router.navigate(['organizations']);
      return false;
    }
    return true;
  }
  constructor(private auth: AuthService, private router: Router, ) { }

}