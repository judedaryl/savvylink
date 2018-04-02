import { Contributor } from './../../model/profile';
import { Injectable } from '@angular/core';
import { Profile } from '../../model/profile';

@Injectable()
export class UserdataService {
  private _id: number;
  private _username: string;
  private _email: string;
  private _photo: string;
  private _name: string;
  profile: Profile;
  constructor() { }

  setData(profile: Profile) {
    this._id = profile.id;
    this._username = profile.username;
    this._email = profile.email;
    this._photo = profile.photo;
    this._name = profile.name;
    this.profile = profile;
  }
  get id(): number {
    return this._id;
  }
  set id(Id: number) {
    this._id = Id;
  }
  get name(): string {
    return this._name;
  }
  set name(Username: string) {
    this._name = name;
  }
  get username(): string {
    return this._username;
  }
  set username(Username: string) {
    this._username = Username;
  }
  get email(): string {
    return this._email;
  }
  set email(Email: string) {
    this._email = Email;
  }
  get photo(): string {
    return this._photo;
  }
  set photo(Photo: string) {
    this._photo = Photo;
  }
}

@Injectable()
export class ContributorDataService {
  private __id: number;
  private _username: string;
  private _email: string;
  private _name: string;
  profile: Contributor;
  constructor() { }

  setData(profile: Contributor) {
    this._id = profile._id;
    this._username = profile.username;
    this._email = profile.email;
    this._name = profile.name;
    this.profile = profile;
  }
  get _id(): number {
    return this.__id;
  }
  set _id(Id: number) {
    this.__id = Id;
  }
  get name(): string {
    return this._name;
  }
  set name(Username: string) {
    this._name = name;
  }
  get username(): string {
    return this._username;
  }
  set username(Username: string) {
    this._username = Username;
  }
  get email(): string {
    return this._email;
  }
  set email(Email: string) {
    this._email = Email;
  }
}
