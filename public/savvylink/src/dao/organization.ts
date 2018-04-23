import { OrganizationListResponse, OrganizationResponse } from './../model/organization';
import { environment } from './../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
declare var $: any;
@Injectable()
export class OrganizationDao {
    constructor(private http: HttpClient) { }

    getList(
        search?: string,
        limit?: string,
        offset?: string,
        order?: string,
        sort?: string,
    ): Observable<OrganizationListResponse> {
        const href = environment.orgApiGet;
        const req =
            `${href}?search=${search}&limit=${limit}&offset=${offset}&order=${order}&sort=${sort}`;
        return this.http.get<OrganizationListResponse>(req);
    }

    getListAll(
        search?: string,
        limit?: string,
        offset?: string,
        order?: string,
        sort?: string,
    ): Observable<OrganizationListResponse> {
        const href = environment.orgApiGetAll;
        const req =
            `${href}?search=${search}&limit=${limit}&offset=${offset}&order=${order}&sort=${sort}`;
        return this.http.get<OrganizationListResponse>(req);
    }

    /**
     * @param contributor_id
     * user_id of contributor
     */
    getListByContributor(
        contributor_id?: string,
        search?: string,
        limit?: string,
        offset?: string,
        order?: string,
        sort?: string,
    ): Observable<OrganizationListResponse> {
        const href = environment.orgApiByContribution;
        const req =
            `${href}?user_id=${contributor_id}&search=${search}&limit=${limit}&offset=${offset}&order=${order}&sort=${sort}`;
        return this.http.get<OrganizationListResponse>(req);
    }

    getListByContributorAll(contributor_id): Observable<OrganizationListResponse> {
        return this.http.get<OrganizationListResponse>(`${environment.orgApiByContribution}?user_id=${contributor_id}&sort=OrganizationName&order=asc`);
    }

    getByID(Id: number): Observable<OrganizationResponse> {
        const href = environment.orgApibyId;
        const req =
            `${href}?id=${Id}`;
        return this.http.get<OrganizationResponse>(req);
    }

    contributeToOrg(org_id: string, user_id: string, user_username: string, user_displayname: string) {
        const obj = { id: org_id, user_id: user_id, user_username: user_username, user_displayname: user_displayname };
        const body = this.addBody(obj);
        return this.http.put(environment.orgApiContribute, body);
    }

    saveCreate(organizationObject: any) {
        const body = this.addBody(organizationObject);
        return this.http.post(environment.orgApiCreate, body);
    }
    saveEditToOrg(organizationObject: any) {
        const body = this.addBody(organizationObject);
        return this.http.put(environment.orgApiEdit, body);
    }

    deleteOrgContribution(org_id: string, user_id: string) {
        let body = new HttpParams();
        body = body.append('id', org_id);
        body = body.append('org_id', org_id);
        body = body.append('user_id', user_id);
        try {
            return this.http.request('delete', environment.orgApiRemoveById, { body: body });
        } catch (error) { }
    }

    count() {
        return this.http.get(environment.orgApiCount);
    }
    private addBody(formObject) {
        let body = new HttpParams();
        $.each(formObject, function (key, value) {
            body = body.append(key, value);
        });
        return body;
    }
}
