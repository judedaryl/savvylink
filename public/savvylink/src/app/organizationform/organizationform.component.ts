import { CurrentUser } from './../models/currentuser';
import { config } from './../../../config/app';
import { HttpClient } from '@angular/common/http';
import { FormService } from './../models/form.service';
import { Organization } from './models/organization';
import { OrgResponse } from './models/response';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';


declare var $: any;
@Component({
  selector: 'app-organizationform',
  templateUrl: './organizationform.component.html',
  styleUrls: ['./organizationform.component.css']
})
export class OrganizationformComponent implements OnInit, AfterViewInit {
  response = OrgResponse;
  user = CurrentUser;

  organization: Organization;
  organizationForm = this.form.organizationform;
  checkorgname: any;
  content = [
    { title: 'Agency' },
    { title: 'Association' },
    { title: 'Company' },
    { title: 'Corporation' },
    { title: 'Firm' },
    { title: 'Government' },
    { title: 'Group' },
    { title: 'Institution' },
    { title: 'Non government' },
    { title: 'Non profit' },
    { title: 'Society' },
  ];

  constructor(private form: FormService, private http: HttpClient) {
    this.Subscriptions();
  }

  get livedata() { return JSON.stringify(this.organizationForm.value); }

  ngOnInit() {

  }

  ngAfterViewInit() {

    // this.enableSearch();

    $('.typesearch').search({
      source: this.content,
      onSelect: (res, resp) => {
        this.organizationForm.get('type').setValue(res.title);
      }
    });



  }

  onSubmit() {
    this.organization = new Organization(this.organizationForm.value);
    this.observeResponse(this.organization.send());
  }

  observeResponse(obs) {
    obs.subscribe(
      data => {
        this.handleResponse(data);
      },
      err => {
        if (err.status === 400) {
          this.handleResponse(err.error);
          /*
          const required = [{field: 'name'}, {field: 'city'}, {field: 'province'}, {field: 'country'}];
          required.forEach((item, value) => {
            if (err.error.error.search(item.field) !== -1) {
              this.response[item.field] = item.field + 'is required';
            }
          });
          */
        }
      }
    );
  }

  handleResponse(param) {
    $('.ui.form').removeClass('loading');
    if (param !== null) {
      if (param['status'] === 'bad') {
        this.response['Error'] = param['data'];
        this.response['HasError'] = true;
      }
      if (param['status'] === 'ok') {
        this.response['mess'] = 'User logged in';
        this.response['HasError'] = false;
      }
    }
  }

  enableSearch() {
    $('.ui.search')
      .search({
        type: 'category',
        minCharacters: 3,
        apiSettings: {
          onResponse: function (google) {
            const response = {
              results: {}
            };
            // translate GitHub API response to work with search
            $.each(google, function (index, item) {
              const language = item.types[0] || item.types[1], maxResults = 8;
              if (index >= maxResults) {
                return false;
              }
              // create new language category
              if (response.results[language] === undefined) {
                response.results[language] = {
                  name: language,
                  results: []
                };
              }
              // add result to category
              response.results[language].results.push({
                title: item.name,
                description: item.formatted_address,
              });
            });
            return response;
          },
          url: 'http://localhost:5000/googlemaps?query={query}'
        }
      });
  }

  Subscriptions() {
    this.form.orgfetch.subscribe(u => {
      this.organizationForm.reset();
      this.organizationForm.controls['user_id'].setValue(this.user['id']);
      // this.SearchOrgName();
    });

    // this.SearchOrgName();

  }

  SearchOrgName() {
    let count = 0;
    this.checkorgname = this.organizationForm.get('name').valueChanges.subscribe(value => {
      if (value !== null) {
        if (value.length >= 4) {
          count = count + 1;
          $('.org-name').addClass('loading');
          this.http.get(config.checkOrgNameApi + '?name=' + value).subscribe(resp => {
            count--;
            if (count === 0) {
              $('.org-name').removeClass('loading');
              $('.org-icon').removeClass('building outline');
              $('.org-icon').removeClass('remove red check green');
              if (!resp['success']) {
                $('.org-icon').addClass('check green');
              } else {
                $('.org-icon').addClass('remove red');
              }
              this.response['HasError'] = resp['success'];
            }
          });
        } else {
          $('.org-name').removeClass('loading');
          this.response['HasError'] = false;
        }
      }
    });
  }
}
