import { Observable } from 'rxjs/Observable';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { CurrentUser } from './currentuser';
@Injectable()
export class FormService {
  organizationform: FormGroup;
  contactform: FormGroup;
  user = CurrentUser;
  user_orglist = [];
  public orgfetch = new Subject<Boolean>();

  get WatchFetch(): Observable<any> {
    return this.orgfetch.asObservable();
  }

  constructor(private build: FormBuilder) {
    this.organizationform = build.group({
      name: ['', Validators.required],
      type: '',
      address_1: '',
      address_2: '',
      city: ['', Validators.required],
      province: ['', Validators.required],
      country: ['', Validators.required],
      user_id: this.user['id'],
      id: '',
      user_displayname: '',
      user_username: '',
    });

    this.contactform = build.group({
      name: [''],
      position: ['', Validators.required],
      user_id: '',
      org_id: '',
      contact: '',
      id: '',
      user_displayname: '',
      user_username: '',
      org_name: '',
    });

  }


}
