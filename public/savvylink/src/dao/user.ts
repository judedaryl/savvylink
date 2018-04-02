import { environment } from './../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Profile } from 'selenium-webdriver/firefox';
declare var $: any;
@Injectable()
export class UserDao {
    constructor(private http: HttpClient) { }

    login(formObject: any): Observable<any> {
        const body = this.addBody(formObject);
        return this.http.post(environment.loginApi, body);
    }

    register(formObject: any): Observable<any> {
        const body = this.addBody(formObject);
        return this.http.post(environment.registerApi, body);
    }

    getProfile(): Observable<Profile> {
        return this.http.get<Profile>(environment.authApi + 'userinfo');
    }

    getProfileUsername(username: string): Observable<Profile> {
        const href = environment.otherUserApi;
        const req =
            `${href}?username=${username}`;
        return this.http.get<Profile>(req);
    }

    addBody(formObject) {
        let body = new HttpParams();
        $.each(formObject, function (key, value) {
            body = body.append(key, value);
        });
        return body;
    }

    checkUsername(username: string) {
        return this.http.get(environment.checkUsernameApi + '?uname=' + username);
    }

    checkEmail(email: string) {
        return this.http.get(environment.checkEmailApi + '?uname=' + email);
    }

    hits() {
        return this.http.post(environment.statisticsApi, null);
    }
}
