import { fadeAnimation } from './../animations/fade.animation';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-organizationspage',
  templateUrl: './organizationspage.component.html',
  styleUrls: ['./organizationspage.component.css'],
  animations: [fadeAnimation],
})
export class OrganizationspageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  public getRouterOutletState(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }

}
