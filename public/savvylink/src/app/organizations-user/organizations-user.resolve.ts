import { config } from './../../../config/app';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { OrganizationService } from './../organization.service';
import { Router, Resolve, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { CurrentUser } from '../models/currentuser';
import { UsersService } from '../users.service';


@Injectable()
export class OrganizationUserResolve implements Resolve<any> {

    constructor(private http: HttpClient,
        private router: Router) {
    }
    resolve(route: ActivatedRouteSnapshot) {
        const user_id = route.parent.data.thisuser.result[0]._id;
        const uname = route.parent.parent.parent.data.content.username;
        return this.http.get(config.orgApiByContribution + '?user_id=' + user_id);
    }
}
