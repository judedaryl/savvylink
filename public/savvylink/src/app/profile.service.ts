import { CurrentUser } from './models/currentuser';
import { Subject } from 'rxjs/Subject';
import { config } from './../../config/app';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ProfileService {

  private user = CurrentUser;
  private profileSubject = new Subject<any>();
  constructor(private httpclient: HttpClient) { }

  public profile() {
    try {
        return this.httpclient.get(config.authApi + 'userinfo');
    } catch (error) {}
  }

  get userdata() { return this.user; }
  set profileData(profileObject: any) {
    this.user = profileObject;
    this.profileSubject.next(profileObject);
  }

  get profileData() {
    return this.profileSubject.asObservable();
  }
}
