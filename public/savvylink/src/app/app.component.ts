import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { Component } from '@angular/core';
declare var $: any;
declare var window: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  constructor(private router: Router, private auth: AuthenticationService) {
    let html = '<div class="sk-cube-grid">';
    html += '<div class="sk-cube sk-cube2"></div>';
    html += '<div class="sk-cube sk-cube3"></div>';
    html += '<div class="sk-cube sk-cube4"></div>';
    html += '<div class="sk-cube sk-cube5"></div>';
    html += '<div class="sk-cube sk-cube6"></div>';
    html += '<div class="sk-cube sk-cube7"></div>';
    html += '<div class="sk-cube sk-cube8"></div>';
    html += '<div class="sk-cube sk-cube9"></div>';
    html += '</div>';

    this.router.events.subscribe(events => {
      $('.ui.modals.page').remove();
      if (events['url'] === '/') {
        if (events instanceof NavigationStart) {
          window.loadingscreen = window.pleaseWait({
            logo: '/assets/logo-white.png',
            backgroundColor: '#d8ab07',
            loadingHtml: html
          });
        }
      }
      if (events instanceof NavigationEnd) {
        if (typeof window.loadingscreen !== 'undefined') {
          window.loadingscreen.finish();
        }
      }
    });
  }
}
