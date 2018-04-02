import { UserExtra } from './../../../../model/extras';
import { OrganizationdataService } from './../../../services/organizationdata.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Contributor } from './../../../../model/profile';
import { UserdataService, ContributorDataService } from './../../../services/userdata.service';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { OrganizationListResponse, Organization } from './../../../../model/organization';
import { OrganizationDao } from './../../../../dao/organization';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import 'rxjs/add/observable/combineLatest';
import { ContributorExtra } from '../../../../model/extras';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PrintService } from '../../../services/print.service';
declare var $: any;
@Component({
  selector: 'app-organization-list-contributor',
  templateUrl: './organization-list-contributor.component.html',
  styleUrls: ['./organization-list-contributor.component.scss']
})
export class OrganizationListContributorComponent implements OnInit, AfterViewInit {
  displayedColumns = ['actions', 'name', 'city', 'province', 'country'];
  dataSource = new MatTableDataSource();
  resultsLength = 0;
  org_form_text = '';
  isLoadingResults = true;
  contributor: Contributor;
  org: Organization;
  organizationform: FormGroup;
  selected_org: Organization;
  isUser = false;
  @ViewChild('paginator')
  private paginator: MatPaginator;
  @ViewChild(MatSort)
  private sort: MatSort;
  searchTrigger: BehaviorSubject<any> = new BehaviorSubject<any>('');
  dialogTrigger: Subject<any> = new Subject<any>();

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

  constructor(
    private cDS: ContributorDataService, private orgDao: OrganizationDao,
    private http: HttpClient, private userDS: UserdataService,
    private orgDS: OrganizationdataService, private builder: FormBuilder,
    private location: Location, private router: ActivatedRoute,
    private print: PrintService) { }

  ngOnInit() {
    this.contributor = this.cDS.profile;
    this.generateForm();
    this.router.params.subscribe(() => {
      if (this.userDS.id !== this.cDS._id) {
        this.displayedColumns = ['name', 'city', 'province', 'country'];
        this.isUser = false;
      } else {
        this.displayedColumns = ['actions', 'name', 'city', 'province', 'country'];
        this.isUser = true;
      }
    });
  }

  ngAfterViewInit() {
    $('.typesearch').search({
      source: this.content,
      onSelect: (res, resp) => {
        this.organizationform.get('type').setValue(res.title);
      }
    });
    this.dao();
  }

  dao() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page, this.searchTrigger.asObservable(), this.dialogTrigger.asObservable()).pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        return this.orgDao.getListByContributor(
          this.contributor._id.toString(),
          this.searchTrigger.getValue(),
          this.paginator.pageSize.toString(),
          (this.paginator.pageIndex * this.paginator.pageSize).toString(),
          this.sort.direction,
          this.sort.active,
        );
      }),
      map((data: OrganizationListResponse) => {
        this.isLoadingResults = false;
        this.resultsLength = data.result.filtered;
        return data.result.data;
      })
    ).subscribe((data: Organization[]) => {
      this.dataSource.data = data;
    });
  }



  generateForm() {
    this.organizationform = this.builder.group({
      name: [this.org_name, Validators.required],
      type: this.type,
      address_1: this.address_1,
      address_2: this.address_2,
      city: [this.city, Validators.required],
      province: [this.province, Validators.required],
      country: [this.country, Validators.required],
      user_id: 0,
      id: this.org_id,
      user_displayname: '',
      user_username: '',
    });

  }


  editOrg(_id) {
    const _org: any = this.dataSource.data.find((data) => data['_id'] === _id);
    this.organizationform.get('name').setValue(_org['name']);
    this.organizationform.get('type').setValue(_org['type']);
    this.organizationform.get('address_1').setValue(_org['address_1']);
    this.organizationform.get('address_2').setValue(_org['address_2']);
    this.organizationform.get('city').setValue(_org['city']);
    this.organizationform.get('province').setValue(_org['province']);
    this.organizationform.get('country').setValue(_org['country']);
    this.organizationform.get('id').setValue(_org['_id']);
    this.organizationform.get('user_id').setValue(_org['user'].user_id);
    this.organizationform.get('user_displayname').setValue(_org['user'].displayname);
    this.organizationform.get('user_username').setValue(_org['user'].username);
    $.each(this.organizationform.value, (key, value) => {
      if (value === 'null') {
        this.organizationform.get(key).setValue('');
      }
    });
    $('.ui.modal.organization_edit').modal({
      onApprove: function () {
        return false;
      }
    }).modal('show');
  }

  submitEditOrg(): void {
    $('.submitorg').addClass('disabled').addClass('loading');
    this.orgDao.saveEditToOrg(this.organizationform.value).subscribe(
      resp => {
        $('.ui.modal.organization_edit').modal('hide');
        $('.submitorg').removeClass('disabled').removeClass('loading');
        this.orgDao.getByID(this.org_id).subscribe(obj => {
          this.dialogTrigger.next();
        });
      },
      err => {
        $('.ui.modal.organization_edit').modal('hide');
        $('.submitorg').removeClass('disabled').removeClass('loading');
      }
    );
  }

  addOrg() {
    this.organizationform.get('name').setValue('');
    this.organizationform.get('type').setValue('');
    this.organizationform.get('address_1').setValue('');
    this.organizationform.get('address_2').setValue('');
    this.organizationform.get('city').setValue('');
    this.organizationform.get('province').setValue('');
    this.organizationform.get('country').setValue('');
    this.organizationform.get('id').setValue(0);
    this.organizationform.get('user_id').setValue(this.userDS.id);
    this.organizationform.get('user_displayname').setValue(this.userDS.name);
    this.organizationform.get('user_username').setValue(this.userDS.username);
    $.each(this.organizationform.value, (key, value) => {
      if (value === 'null') {
        this.organizationform.get(key).setValue('');
      }
    });
    $('.ui.modal.organization_create').modal({
      onApprove: function () {
        return false;
      }
    }).modal('show');
  }

  submitCreateOrg(): void {
    $('.submitorg').addClass('disabled').addClass('loading');
    this.orgDao.saveCreate(this.organizationform.value).subscribe(
      resp => {
        $('.ui.modal.organization_create').modal('hide');
        $('.submitorg').removeClass('disabled').removeClass('loading');
        this.orgDao.getByID(this.org_id).subscribe(obj => {
          this.dialogTrigger.next();
        });
      },
      err => {
        $('.ui.modal.organization_create').modal('hide');
        $('.submitorg').removeClass('disabled').removeClass('loading');
      }
    );
  }

  showApprove(_id) {
    const _org: any = this.dataSource.data.find((data) => data['_id'] === _id);
    this.orgDS.setData(_org);
    $('.approvalDelete').modal({
      onApprove: function () {
        return false;
      }
    }).modal('show');
  }

  delete(id: number): void {
    $('.deleteorgbtn').addClass('disabled').addClass('loading');
    this.orgDao.deleteOrgContribution(id.toString(), this.userDS.id.toString()).subscribe(
      () => {
        $('.approvalDelete').modal('hide');
        $('.deleteorgbtn').removeClass('disabled').removeClass('loading');
        this.dialogTrigger.next();
      });
  }

  printpdf() {
    const columns = [
      { title: 'Organization', dataKey: 'name' },
      { title: 'City', dataKey: 'cty' },
      { title: 'Province', dataKey: 'prv' },
      { title: 'Country', dataKey: 'cnt' },
    ];
    const rows = [];
    this.dataSource.data.forEach(element => {
      rows.push({
        'name': element['name'],
        'cty': element['city'],
        'prv': element['province'],
        'cnt': element['country'],
      });
    });
    const pdftitle = this.cDS.name + '- Organizations';
    this.print.printpdf(columns, rows, pdftitle, 'Organizations being contributed by: ' + this.cDS.name + '.');
  }


  get org_id() {
    return this.orgDS._id;
  }
  get org_name() {
    return this.orgDS.name;
  }
  get address_1() {
    return this.orgDS.address_1;
  }
  get address_2() {
    return this.orgDS.address_2;
  }
  get city() {
    return this.orgDS.city;
  }

  get country() {
    return this.orgDS.country;
  }
  get province() {
    return this.orgDS.province;
  }
  get type() {
    return this.orgDS.type;
  }
  get contributors(): ContributorExtra[] {
    return this.orgDS.contributors;
  }
  get user(): UserExtra {
    return this.orgDS.user;
  }
  get curUser_id() {
    return this.userDS.id;
  }

}
