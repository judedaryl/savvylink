import { HttpService } from './../app.injector';
import { config } from './../../../config/app';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

declare var $: any;
export class User {
    private httpclient = HttpService;
    private user: any;

    constructor(user?: any) {
        if (user !== null) { this.user = user; }
    }


    public register() {
        const body = this.HttpParams;
        try {
            return this.httpclient.post(config.regApi, body);
        } catch (error) {}
    }

    public login() {
        const body = this.HttpParams;
        try {
            return this.httpclient.post(config.logApi, body);
        } catch (error) {}
    }


    get HttpParams(): HttpParams {
        let body = new HttpParams();
        $.each(this.user, function(key, value) {
            body = body.append(key, value);
        });
        return body;
    }
}
