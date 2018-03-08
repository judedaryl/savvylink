import { Observable } from 'rxjs/Observable';
import { OrganizationService } from './../organization.service';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { ContactService } from '../contact.service';

@Injectable()
export class ContactsResolve implements Resolve<any> {
    constructor(private contactService: ContactService, private router: Router) {
    }
      resolve(route: ActivatedRouteSnapshot) {
         const org_id = route.params['orgid'];
        return this.contactService.getContactsByOrg(org_id);
    }
}
