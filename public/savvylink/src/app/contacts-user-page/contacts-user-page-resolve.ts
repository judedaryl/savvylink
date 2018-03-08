import { config } from './../../../config/app';
import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
@Injectable()
export class ContactsUserPageResolve implements Resolve<any> {
    constructor(private router: Router, private http: HttpClient) { }

    resolve(route: ActivatedRouteSnapshot) {
        const user_id = route.parent.data.thisuser.result[0]._id;
        const uname = route.parent.parent.parent.data.content.username;
        return this.http.get(config.contactApiGetByUsers + '?user_id=' + user_id + '&username=' + uname + '&query=');
    }
}
