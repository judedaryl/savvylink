import { PrintService } from './../print.service';
import { CurrentContributor } from './../models/currentcontributor';
import { ActivatedRoute } from '@angular/router';
import { fadeAnimation } from './../animations/fade.animation';
import { Organization } from './../organizationform/models/organization';
import { FormService } from './../models/form.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CurrentUser } from '../models/currentuser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OrganizationsComponent } from '../organizations/organizations.component';
declare var $: any;
@Component({
  selector: 'app-contributions-user',
  templateUrl: './contributions-user.component.html',
  styleUrls: ['./contributions-user.component.css'],
  animations: [fadeAnimation],
})
export class ContributionsUserComponent implements OnInit, AfterViewInit {
  contributor = CurrentContributor;
  user = CurrentUser;
  isUser = false;
  constructor(private route: ActivatedRoute, private print: PrintService) { }
  ngAfterViewInit() {
    $('.ui.dropdown.orgmenu').dropdown();
  }
  ngOnInit() {
    const userid = this.route.snapshot.parent.parent.data.content.id;
    const contri = this.route.snapshot.data.thisuser.result[0];
    this.contributor['name'] = contri['name'];
    this.contributor['id'] = contri['_id'];
    this.contributor['username'] = contri['username'];
    this.contributor['email'] = contri['email'];
    this.isUser = (userid === contri['_id']) ? true : false;
  }

  public getRouterOutletState(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }

}
