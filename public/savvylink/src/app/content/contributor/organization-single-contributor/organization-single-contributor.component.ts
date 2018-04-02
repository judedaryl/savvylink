import { AfterViewInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { OrganizationDao } from './../../../../dao/organization';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContributorExtra, UserExtra } from './../../../../model/extras';
import { Organization } from './../../../../model/organization';
import { ContributorDataService, UserdataService } from './../../../services/userdata.service';
import { OrganizationdataService } from './../../../services/organizationdata.service';
import { ActivatedRoute } from '@angular/router';
import { Contributor } from '../../../../model/profile';
import { ContactListResponse, Contact } from './../../../../model/contact';
import { ContactDao } from './../../../../dao/contact';
import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
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
import { Location } from '@angular/common';
import { PrintService } from '../../../services/print.service';

declare var $: any;
@Component({
  selector: 'app-organization-single-contributor',
  templateUrl: './organization-single-contributor.component.html',
  styleUrls: ['./organization-single-contributor.component.scss']
})
export class OrganizationSingleContributorComponent implements OnInit, AfterViewInit, OnDestroy {
  isUser = false;
  contact: FormGroup;
  contributor: Contributor;
  org: Organization;
  organizationform: FormGroup;
  displayedColumns = ['actions', 'con.ContactPosition', 'con.ContactName', 'org.OrganizationName'];
  dataSource = new MatTableDataSource();
  resultsLength = 0;
  isLoadingResults = true;
  selected_contact_id = 0;

  data: Object = {
    user_id: '',
    user_username: '',
    user_displayname: '',
    org_id: '',
    org_name: '',
    id: '',
  };

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
    private route: ActivatedRoute, private orgDS: OrganizationdataService,
    private cDS: ContributorDataService, private builder: FormBuilder,
    private orgDao: OrganizationDao, private userDS: UserdataService,
    private contactDao: ContactDao, private location: Location,
    private print: PrintService
  ) { }
  ngOnInit() {
    this.route.params.subscribe(() => {
      this.initializeData(this.route.snapshot.data.content['result'][0]);
      this.generateForm();
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
  ngOnDestroy() {

  }

  initializeData(data: Organization) {
    this.orgDS.setData(data);
    this.org = this.orgDS._organization;
    this.contributor = this.cDS.profile;
    this.isUser = this.userDS.id === this.cDS._id;
    this.generateForm();
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
      user_id: this.user.user_id,
      id: this.org_id,
      user_displayname: this.user.displayname,
      user_username: this.user.username,
    });

    this.contact = this.builder.group({
      name: [''],
      position: ['', Validators.required],
      user_id: this.userDS.id,
      org_id: this.org_id,
      contact: '',
      id: 0,
      user_displayname: this.userDS.name,
      user_username: this.userDS.username,
      org_name: '',
    });
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

  editOrg() {
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
          this.initializeData(obj.result[0]);
          this.dialogTrigger.next();
        });
      },
      err => {
        $('.ui.modal.organization_edit').modal('hide');
        $('.submitorg').removeClass('disabled').removeClass('loading');
      }
    );
  }

  showApprove() {
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
        this.location.back();
      });
  }

  dao() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page, this.searchTrigger.asObservable(), this.dialogTrigger.asObservable()).pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        return this.contactDao.getListByOrgAndContribution(
          this.org_id.toString(),
          this.cDS._id.toString(),
          this.searchTrigger.getValue(),
          this.paginator.pageSize.toString(),
          (this.paginator.pageIndex * this.paginator.pageSize).toString(),
          this.sort.direction,
          this.sort.active,
        );
      }),
      map((data: ContactListResponse) => {
        this.isLoadingResults = false;
        this.resultsLength = data.result.filtered;
        return data.result.data;
      })
    ).subscribe((data: Contact[]) => {
      this.dataSource.data = data;
    });
  }

  editContact(id) {
    this.contact.reset();
    this.data['id'] = id;
    const con = this.dataSource.data.find(x => x['_id'] === id);
    this.contact.controls['position'].setValue(con['position']);
    this.contact.controls['user_id'].setValue(con['user_id']);
    this.contact.controls['org_id'].setValue(con['org_id']);
    this.contact.controls['id'].setValue(con['_id']);
    this.contact.controls['user_username'].setValue(con['user']['username']);
    this.contact.controls['user_displayname'].setValue(con['user']['displayname']);
    this.contact.controls['org_name'].setValue(con['org_name']);
    if (con['name'] === 'null') { con['name'] = ''; }
    this.contact.controls['name'].setValue(con['name']);
    $('.ui.modal.edit_contact').modal({
      onApprove: function () {
        return false;
      }
    }).modal('show');
  }

  submitEditContact(): void {
    $('.ui.positive.right.labeled').addClass('disabled').addClass('loading');
    this.contactDao.saveEdit(this.contact.value).subscribe(data => {
      this.contact.reset();
      $('.ui.modal.edit_contact').modal('hide');
      $('.ui.positive.right.labeled').removeClass('disabled').removeClass('loading');
      this.dialogTrigger.next();
    },
      err => {
        $('.ui.modal.edit_contact').modal('hide');
        $('.ui.positive.right.labeled').removeClass('disabled').removeClass('loading');
      });
  }

  addContact() {
    this.contact.reset();
    $('.ui.modal.contacts').modal({
      onApprove: function () {
        return false;
      }
    }).modal('show');
  }

  submitContact(): void {
    $('.ui.positive.right.labeled').addClass('disabled').addClass('loading');
    this.contact.controls['user_id'].setValue(this.cDS._id);
    this.contact.controls['org_id'].setValue(this.orgDS._id);
    this.contact.controls['user_username'].setValue(this.cDS.username);
    this.contact.controls['user_displayname'].setValue(this.cDS.name);
    this.contact.controls['org_name'].setValue(this.orgDS.name);
    this.contactDao.saveCreate(this.contact.value).subscribe(data => {
      this.contact.reset();
      $('.ui.modal.contacts').modal('hide');
      $('.ui.positive.right.labeled').removeClass('disabled').removeClass('loading');
      this.dialogTrigger.next();
    });
  }

  deleteApprove(id) {
    this.selected_contact_id = id;
    $('.delete_contact').modal({
      onApprove: function () {
        return false;
      }
    }).modal('show');
  }

  delete_contact(id): void {
    $('.deleteapproveBtn').addClass('disabled').addClass('loading');
    this.contactDao.delete(id).subscribe(resp => {
      this.dialogTrigger.next();
      $('.delete_contact').modal('hide');
      $('.deleteapproveBtn').removeClass('disabled').removeClass('loading');
    });
  }

  printpdf() {
    const columns = [
      { title: 'Name', dataKey: 'name' },
      { title: 'Position', dataKey: 'pos' },
    ];
    const rows = [];
    this.dataSource.data.forEach(element => {
      rows.push({
        'name': element['name'],
        'pos': element['position'],
      });
    });
    const pdftitle = this.cDS.name + ' - ' + this.orgDS.name + ' - Contacts';
    this.print.printpdf(columns, rows, pdftitle, 'Contact list from ' + this.orgDS.name + ' contributed by ' + this.cDS.name);
  }
}
