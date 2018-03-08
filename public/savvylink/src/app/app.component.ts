import { Router } from '@angular/router/';
import { fadeAnimation } from './animations/fade.animation';
import { Component } from '@angular/core';


declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  // animations: [fadeAnimation]
})
export class AppComponent {

  constructor(private router: Router) {
    this.router.events.subscribe(events => {
      $('.ui.modals.page').remove();
    });
  }
  public getRouterOutletState(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }
}
