import { HttpService } from './../../app.injector';
import { AppModule } from './../../app.module';
import { config } from './../../../../config/app';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

declare var $: any;
export class Contact {
    private httpclient = HttpService;
    private contact: any;

    constructor(contact: any) {
        this.contact = contact;

    }

    public create() {
        let body = new HttpParams();
        $.each(this.contact, function (key, value) {
            body = body.append(key, value);
        });
        try {
            return this.httpclient.post(config.contactApiCreate, body);
        } catch (error) { }
    }

    public edit() {
        let body = new HttpParams();
        $.each(this.contact, function (key, value) {
            body = body.append(key, value);
        });
        try {
            return this.httpclient.put(config.contactApiEdit, body);
        } catch (error) { }
    }


    public delete(id) {
        let body = new HttpParams();
        body = body.append('id', id);
        console.log(body);
        try {
            return this.httpclient.request('delete', config.contactApiRemoveById, { body: body });
        } catch (error) { }
    }


}
