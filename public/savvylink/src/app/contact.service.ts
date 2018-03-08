import { config } from './../../config/app';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ContactService {

  constructor(private http: HttpClient) { }

  public getContacts(query?: string) {
    const q = query || '';
    return this.http.get(config.contactApiGet + 'get?query=' + q);
  }

  public getContactsByOrg(query?: string) {
    const q = query || '';
    return this.http.get(config.contactApiGetByOrg + '?org_id=' + q + '&query=');
  }
  public getContactsByUser(q: string) {
    return this.http.get(config.contactApiGetByUser + '?user_id=' + q + '&query=');
  }

  public getContactDetails(org_id) {
    return this.http.get(config.orgApibyId + '?id=' + org_id);
  }
}
