import { ProfileService } from './profile.service';
import { AuthService } from './auth/auth.service';
import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { UsersService } from './users.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
@Injectable()
export class UserDataResolve implements Resolve<any> {
    constructor(private profile: ProfileService, private auth: AuthService,
    private router: Router) { }

    resolve() {
        if (this.auth.getToken) {
            return this.profile.profile().catch(err => {
                this.router.navigate(['/']);
                return Observable.empty();
            });
        } else { return null; }
    }
}
