import { Observable } from 'rxjs/Observable';
import { OrganizationService } from './../organization.service';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class OrganizationsResolve implements Resolve<any> {
    constructor(private orgService: OrganizationService, private router: Router) {
    }
    resolve() {
        return this.orgService.getOrganizations();
    }
}
