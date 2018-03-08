import { Organization } from './../organizationform/models/organization';
import { fadeAnimation } from './../animations/fade.animation';
import { HttpClient } from '@angular/common/http';
import { CurrentUser } from './../models/currentuser';
import { User } from './../models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from './../models/form.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { config } from '../../../config/app';
import { CurrentOrganization } from '../models/currentorganization';
import { Location } from '@angular/common';
declare var $: any;
@Component({
  selector: 'app-organization-user',
  templateUrl: './organization-user.component.html',
  styleUrls: ['./organization-user.component.css']
})
export class OrganizationUserComponent implements OnInit, AfterViewInit {
  user = CurrentUser;
  org = CurrentOrganization;
  otherUser: any;
  orgform = this.form.organizationform;
  orgmodel = new Organization(null);
  orgid: string;
  content: any;
  searchform: FormGroup;
  approvesmodal: Object = {
    headers: '',
    texts: '',
    delete_org_ids: '',
  };
  isUser = true;

  constructor(private builder: FormBuilder, private form: FormService,
    private route: ActivatedRoute, private http: HttpClient,
    private router: Router, private location: Location) {
    this.searchformMethod();
  }

  ngOnInit() {
    this.otherUser = this.route.snapshot.parent.data['thisuser']['result'][0];
    const contri = this.route.snapshot.parent.parent.parent.data.content; // APP
    this.content = this.route.snapshot.data.content.result[0]; // ORG USER
    const contributor = this.content['contributors'].find(x => x['_id'] === contri['id']);
    const user = this.route.snapshot.parent.parent.parent.data.content;
    this.isUser = (this.otherUser['_id'] === user['id']) ? true : false;
    if (this.content !== null) {
      this.org['name'] = this.content['name'];
      this.org['type'] = this.content['type'];
      this.org['address_1'] = this.content['address_1'];
      this.org['address_2'] = this.content['address_2'];
      this.org['city'] = this.content['city'];
      this.org['province'] = this.content['province'];
      this.org['country'] = this.content['country'];
      this.org['_id'] = this.content['_id'];

    }
  }

  searchformMethod() {
    this.searchform = this.builder.group({
      search: ''
    });

    this.searchform.controls['search'].valueChanges.subscribe(data => {
      // this.form.orgfetch.next(data);
    });
  }

  ngAfterViewInit() {

  }

  editOrg(id) {
    this.orgform.reset();
    const org = this.org;
    if (org['type'] === 'null') { org['type'] = ''; }
    if (org['address_1'] === 'null') { org['address_1'] = ''; }
    if (org['address_2'] === 'null') { org['address_2'] = ''; }
    this.orgform.controls['name'].setValue(org['name']);
    this.orgform.controls['type'].setValue(org['type']);
    this.orgform.controls['address_1'].setValue(org['address_1']);
    this.orgform.controls['address_2'].setValue(org['address_2']);
    this.orgform.controls['city'].setValue(org['city']);
    this.orgform.controls['province'].setValue(org['province']);
    this.orgform.controls['country'].setValue(org['country']);
    this.orgform.controls['id'].setValue(org['_id']);
    $('.ui.modal.organization_edit').modal({
      onApprove: function () {
        return false;
      }
    }).modal('show');
  }

  submitEditOrg(): void {
    $('.submitorg').addClass('disabled').addClass('loading');
    this.orgform.controls['user_id'].setValue(this.user['id']);
    const org = new Organization(this.orgform.value);
    org.edit().subscribe(data => {
      $('.ui.modal.organization_edit').modal('hide');
      $('.submitorg').removeClass('disabled').removeClass('loading');
      this.org['name'] = this.orgform.controls['name'].value;
      this.org['address_1'] = this.orgform.controls['address_1'].value;
      this.org['address_2'] = this.orgform.controls['address_2'].value;
      this.org['type'] = this.orgform.controls['type'].value;
      this.org['city'] = this.orgform.controls['city'].value;
      this.org['province'] = this.orgform.controls['province'].value;
      this.org['country'] = this.orgform.controls['country'].value;

      this.form.orgfetch.next();
    });
  }

  showApprove(option, id, name) {
    console.log(this.org);
    switch (option) {
      case 'delete':
        this.approvesmodal['headers'] = 'Delete organization.';
        this.approvesmodal['texts'] = 'Are you sure you want to remove ' + name + ' from the list?';
        this.approvesmodal['delete_org_ids'] = id;
        break;
    }
    $('.approvalDelete').modal({
      onApprove: function () {
        return false;
      }
    }).modal('show');
  }

  delete(id): void {
    $('.deleteorgbtn').addClass('disabled').addClass('loading');
    this.orgmodel.delete(id, this.user['id']).subscribe(resp => {

      $('.approvalDelete').modal('hide');
      $('.deleteorgbtn').removeClass('disabled').removeClass('loading');
      this.location.back();
    });
  }
}
