import { AuthService } from './../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router/';
import { Component, OnInit } from '@angular/core';
import { SemanticService } from '../semantic.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  isLoggedIn_ = false;
  numbers = (10000000).toLocaleString('en');

  constructor(private auth: AuthService, private semantic: SemanticService) {
    if (this.auth.getToken !== null) { this.isLoggedIn = true; } else { this.isLoggedIn = false; }
    this.Subscriptions();
  }
  ngOnInit() {
  }

  Subscriptions() {
    this.auth.WatchAuthenticated.subscribe(data => {
      this.isLoggedIn = data;
    });
  }

  get isLoggedIn(): boolean {
    return this.isLoggedIn_;
  }
  set isLoggedIn(value: boolean) {
    this.isLoggedIn_ = value;
    this.semantic.initDropdown();
  }



}
