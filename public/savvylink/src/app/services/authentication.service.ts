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
    localStorage.setItem('token', token);
  }

  get getToken(): string {
    return localStorage.getItem('token');
  }

  get isAuthenticated(): boolean {

    return (localStorage.getItem('token') !== null);
  }
  removeToken(): void {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/');
  }
}
