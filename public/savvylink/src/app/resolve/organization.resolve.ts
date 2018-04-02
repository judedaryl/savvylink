import { AuthenticationService } from './../services/authentication.service';
import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import { OrganizationDao } from '../../dao/organization';
@Injectable()
export class OrganizationGlobalResolve implements Resolve<any> {
    constructor(private auth: AuthenticationService, private orgDao: OrganizationDao,
    private router: Router) { }

    resolve(route: ActivatedRouteSnapshot) {
        if (this.auth.getToken) {
            return this.orgDao.getByID(route.params['org_id']).catch(err => {
                this.router.navigate(['/']);
                return Observable.empty();
            });
        } else { return null; }
    }
}
