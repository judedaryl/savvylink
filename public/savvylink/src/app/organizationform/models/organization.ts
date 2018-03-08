import { HttpService } from './../../app.injector';
import { AppModule } from './../../app.module';
import { config } from './../../../../config/app';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

declare var $: any;
export class Organization {
    private httpclient = HttpService;
    private organization: any;

    constructor(organization: any) {
        this.organization = organization;

    }

    public send() {
        let body = new HttpParams();
        $.each(this.organization, function (key, value) {
            body = body.append(key, value);
        });
        try {
            return this.httpclient.post(config.orgApi + 'create', body);
        } catch (error) { }
    }

    public delete(id, user_id) {
        let body = new HttpParams();
        body = body.append('id', id);
        body = body.append('user_id', user_id);
        try {
            return this.httpclient.request('delete', config.orgApiRemoveById, { body: body });
        } catch (error) { }
    }

    public edit() {
        let body = new HttpParams();
        $.each(this.organization, function (key, value) {
            body = body.append(key, value);
        });
        try {
            return this.httpclient.put(config.orgApiEdit, body);
        } catch (error) { }
    }
}
