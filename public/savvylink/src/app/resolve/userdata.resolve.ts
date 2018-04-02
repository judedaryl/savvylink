import { AuthenticationService } from './../services/authentication.service';
import { UserDao } from './../../dao/user';
import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
@Injectable()
export class UserDataResolve implements Resolve<any> {
    constructor(private auth: AuthenticationService, private userDao: UserDao,
    private router: Router) { }

    resolve() {
        if (this.auth.getToken) {
            return this.userDao.getProfile().catch(err => {
                this.router.navigate(['/']);
                return Observable.empty();
            });
        } else { return null; }
    }
}

@Injectable()
export class UserNameResolve implements Resolve<any> {
    constructor(private auth: AuthenticationService, private userDao: UserDao,
    private router: Router) { }

    resolve(route: ActivatedRouteSnapshot) {
        if (this.auth.getToken) {
            return this.userDao.getProfileUsername(route.params['username']).catch(err => {
                this.router.navigate(['/']);
                return Observable.empty();
            });
        } else { return null; }
    }
}
