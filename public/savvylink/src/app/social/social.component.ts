import { AuthService } from './../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';


declare var $: any;
@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.css']
})
export class SocialComponent {

  token = '';

  constructor(private route: ActivatedRoute, private router: Router, private auth: AuthService) {


    this.route.params.subscribe(params => {
      const token = params['token'];
      switch (params['social']) {
        case 'facebook':
          this.auth.facebook(token);
          break;
        case 'github':
          this.auth.github(token);
          break;
        case 'linkedin':
          this.auth.linkedin(token);
          break;
        case 'google':
          this.auth.google(token);
          break;
      }
      this.router.navigateByUrl('/');
    });
  }
}
