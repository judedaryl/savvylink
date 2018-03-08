import { Observable } from 'rxjs/Observable';
import { OrganizationService } from './../organization.service';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from '../../../config/app';

@Injectable()
export class UserContributionResolve implements Resolve<any> {
    constructor(private http: HttpClient, private router: Router) {
    }
    resolve(route: ActivatedRouteSnapshot) {
        return this.http.get(config.otherUserApi + '?username=' + route.params['username']).catch(x => {
            return Observable.empty();
        });


    }
}
