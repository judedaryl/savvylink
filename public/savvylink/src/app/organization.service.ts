import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from '../../config/app';

@Injectable()
export class OrganizationService {

  constructor(private http: HttpClient) { }

  public getOrganizations(query?: string) {
    const q = query || '';
    return this.http.get(config.orgApi + 'get?query=' + q);
  }
  public getOrganizationsByUserID(id: string, uname: string) {
    return this.http.get(config.orgApiByUser + '?user_id=' + id + '&username=' + uname + '&query=');
  }
  public getOrgDetails(org_id, uname): Observable<any> {
    return this.http.get(config.orgApibyId + '?id=' + org_id + '&username=' + uname);
  }
}
