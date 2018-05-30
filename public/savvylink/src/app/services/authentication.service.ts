import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AuthenticationService {

  constructor(private router: Router) { }

  login(token) {
    this.saveToken(token.data);
    window.location.href = '/';
  }

  logout() {
    this.removeToken();
    this.router.navigateByUrl('/login');
  }
  private saveToken(token) {
    localStorage.setItem('SAVVYLINK_TOKEN', token);
  }

  get getToken(): string {
    return localStorage.getItem('SAVVYLINK_TOKEN');
  }

  get isAuthenticated(): boolean {

    return (localStorage.getItem('SAVVYLINK_TOKEN') !== null);
  }
  removeToken(): void {
    localStorage.removeItem('SAVVYLINK_TOKEN');
    this.router.navigateByUrl('/');
  }
}
