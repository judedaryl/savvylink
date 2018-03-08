import { Observable } from 'rxjs/Observable';
import { OrganizationService } from './../organization.service';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class MainPageResolve implements Resolve<any> {
    constructor(private orgService: OrganizationService, private router: Router) {
    }
      resolve(route: ActivatedRouteSnapshot) {
        const id = route.params['orgid'];
        return this.orgService.getOrgDetails(id, null).catch(x => {
            return Observable.empty();
        });
    }
}
