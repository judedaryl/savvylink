import { Router } from '@angular/router/';
import { config } from './../../../config/app';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable, OnInit } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AuthService {

  private authSubject = new Subject<Boolean>();
  constructor(private route: Router) {
    if (this.getToken) {
      this.authSubject.next(true);
    }
  }

  saveToken(token) {
    localStorage.setItem('token', token);
    this.authSubject.next(true);
  }

  get getToken() {
    return localStorage.getItem('token');
  }

  removeToken(): void {
    localStorage.removeItem('token');
    this.authSubject.next(false);
    this.route.navigateByUrl('/');
  }

  get WatchAuthenticated(): Observable<any> {
    return this.authSubject.asObservable();
  }

  get linkedinUrl(): string {
    return config.linkedin;
  }

  facebook(token): void {
    this.saveToken(token);
  }

  github(token): void {
    this.saveToken(token);
  }

  linkedin(token): void {
    this.saveToken(token);
  }

  google(token): void {
    this.saveToken(token);
  }

}
