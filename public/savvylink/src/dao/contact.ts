import { ContactListResponse } from './../model/contact';
import { environment } from './../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
declare var $: any;
@Injectable()
export class ContactDao {
    constructor(private http: HttpClient) { }

    getList(
        search?: string,
        limit?: string,
        offset?: string,
        order?: string,
        sort?: string,
    ): Observable<ContactListResponse> {
        const href = environment.contactApiGet;
        const req =
            `${href}?search=${search}&limit=${limit}&offset=${offset}&order=${order}&sort=${sort}`;
        return this.http.get<ContactListResponse>(req);
    }

    getListByOrg(
        org_id?: string,
        search?: string,
        limit?: string,
        offset?: string,
        order?: string,
        sort?: string,
    ): Observable<ContactListResponse> {
        const href = environment.contactApiGetByOrg;
        const req =
            `${href}?org_id=${org_id}&search=${search}&limit=${limit}&offset=${offset}&order=${order}&sort=${sort}`;
        return this.http.get<ContactListResponse>(req);
    }

    getListByContribution(
        user_id?: string,
        search?: string,
        limit?: string,
        offset?: string,
        order?: string,
        sort?: string,
    ): Observable<ContactListResponse> {
        const href = environment.contactApiGetByUsers;
        const req =
            `${href}?user_id=${user_id}&search=${search}&limit=${limit}&offset=${offset}&order=${order}&sort=${sort}`;
        return this.http.get<ContactListResponse>(req);
    }

    getListByOrgAndContribution(
        org_id?: string,
        user_id?: string,
        search?: string,
        limit?: string,
        offset?: string,
        order?: string,
        sort?: string,
    ): Observable<ContactListResponse> {
        const href = environment.contactApiGetByOrgContribution;
        const req =
            `${href}?org_id=${org_id}&user_id=${user_id}&search=${search}&limit=${limit}&offset=${offset}&order=${order}&sort=${sort}`;
        return this.http.get<ContactListResponse>(req);
    }

    public delete(id) {
        let body = new HttpParams();
        body = body.append('id', id);
        try {
            return this.http.request('delete', environment.contactApiRemoveById, { body: body });
        } catch (error) { }
    }

    saveEdit(object: any) {
        let body = new HttpParams();
        $.each(object, function (key, value) {
            body = body.append(key, value);
        });
        try {
            return this.http.put(environment.contactApiEdit, body);
        } catch (error) { }
    }

    saveCreate(object: any) {
        let body = new HttpParams();
        $.each(object, function (key, value) {
            body = body.append(key, value);
        });
        try {
            return this.http.post(environment.contactApiCreate, body);
        } catch (error) { }
    }

    addBody(formObject) {
        let body = new HttpParams();
        $.each(formObject, function (key, value) {
            body = body.append(key, value);
        });
        return body;
    }

}
