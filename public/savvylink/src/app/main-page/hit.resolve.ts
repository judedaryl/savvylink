import { AuthService } from './../auth/auth.service';
import { config } from './../../../config/app';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { OrganizationService } from './../organization.service';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class HitResolve implements Resolve<any> {
    constructor(private http: HttpClient, private auth: AuthService) {
    }
    resolve(route: ActivatedRouteSnapshot) {
        const id = route.params['orgid'];
        return this.http.post(config.statisticsApi, null);
    }

}
