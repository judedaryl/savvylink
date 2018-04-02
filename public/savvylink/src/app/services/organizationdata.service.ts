import { ContributorExtra, UserExtra } from './../../model/extras';
import { Organization } from './../../model/organization';
import { Injectable } from '@angular/core';

@Injectable()
export class OrganizationdataService {
  _organization: Organization;
  _id = 0;
  address_1 = '';
  address_2 = '';
  city = '';
  contributors: ContributorExtra[] = [];
  country = '';
  name = '';
  province = '';
  type = '';
  user: UserExtra = undefined;
  user_id = 0;
  constructor() { }

  setData(organization: Organization) {
    this._id = organization._id;
    this.address_1 = organization.address_1;
    this.address_2 = organization.address_2;
    this.city = organization.city;
    this.contributors = organization.contributors;
    this.country = organization.country;
    this.name = organization.name;
    this.province = organization.province;
    this.type = organization.type;
    this.user = organization.user;
    this.user_id = organization.user_id;
    this._organization = organization;
  }
}
