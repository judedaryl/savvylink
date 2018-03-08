import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from '../../config/app';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class UsersService {
  public profileRequest = new Subject<Boolean>();
  constructor(private httpclient: HttpClient) { }

  get profile() {
    try {
        return this.httpclient.get(config.authApi + 'userinfo');
    } catch (error) {}
  }

  get WatchProfileRequest(): Observable<any> {
    return this.profileRequest.asObservable();
  }

}
