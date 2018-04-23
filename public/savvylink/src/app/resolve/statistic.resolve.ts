import { ContactDao } from './../../dao/contact';
import { UserDao } from './../../dao/user';
import { AuthenticationService } from './../services/authentication.service';
import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import { OrganizationDao } from '../../dao/organization';
@Injectable()
export class StatisticsResolve implements Resolve<any> {
    constructor(private auth: AuthenticationService, private orgDao: OrganizationDao,
    private router: Router, private userDao: UserDao, private conDao: ContactDao) { }

    resolve(route: ActivatedRouteSnapshot) {
        if (this.auth.getToken) {
            const conCountReq = this.conDao.count();
            const orgCountReq = this.orgDao.count();
            const lookupCombined = Observable.combineLatest(conCountReq, orgCountReq);
            return lookupCombined.catch(err => {
                this.router.navigate(['/']);
                return Observable.empty();
            });
        } else { return null; }
    }
}
