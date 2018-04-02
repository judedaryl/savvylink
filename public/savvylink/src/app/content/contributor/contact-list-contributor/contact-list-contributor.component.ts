import { PrintService } from './../../../services/print.service';
import { ActivatedRoute } from '@angular/router';
import { OrganizationDao } from './../../../../dao/organization';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserExtra } from './../../../../model/extras';
import { Contributor, Profile } from './../../../../model/profile';
import { ContributorDataService, UserdataService } from './../../../services/userdata.service';
import { ContactListResponse, Contact } from './../../../../model/contact';
import { ContactDao } from './../../../../dao/contact';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { environment } from './../../../../environments/environment';
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
declare var $: any;
@Component({
  selector: 'app-contact-list-contributor',
  templateUrl: './contact-list-contributor.component.html',
  styleUrls: ['./contact-list-contributor.component.scss']
})
export class ContactListContributorComponent implements OnInit, AfterViewInit {
  displayedColumns = ['actions', 'con.ContactPosition', 'con.ContactName', 'org.OrganizationName'];
  dataSource = new MatTableDataSource();
  resultsLength = 0;
  selected_contact_id = 0;
  isLoadingResults = true;
  isUser = false;
  user: Profile;
  contact: FormGroup;
  orglist = [{ name: '', value: '', selected: false }];
  organizations = [];
  @ViewChild('paginator')
  private paginator: MatPaginator;
  @ViewChild(MatSort)
  private sort: MatSort;
  searchTrigger: BehaviorSubject<any> = new BehaviorSubject<any>('');
  dialogTrigger: Subject<any> = new Subject<any>();
  contributor: Contributor;

  data: Object = {
    user_id: '',
    user_displayname: '',
    user_username: '',
    org_id: '',
    org_name: '',
  };

  constructor(private print: PrintService, private route: ActivatedRoute, private contactDao: ContactDao, private cDS: ContributorDataService, private builder: FormBuilder, private orgDao: OrganizationDao, private userDS: UserdataService) { }
  ngOnInit() {
    this.contributor = this.cDS.profile;

    this.route.params.subscribe(() => {
      if (this.userDS.id !== this.cDS._id) {
        this.displayedColumns = ['con.ContactPosition', 'con.ContactName', 'org.OrganizationName'];
        this.isUser = false;
      } else {
        this.displayedColumns = ['actions', 'con.ContactPosition', 'con.ContactName', 'org.OrganizationName'];
        this.isUser = true;
      }
      this.initializeData();
    });

  }

  initializeData() {
    this.isUser = this.userDS.id === this.cDS._id;
    this.generateForm();
    this.dialogTrigger.next();
  }

  ngAfterViewInit() {
    this.dao();
  }

  generateForm() {
    this.contact = this.builder.group({
      name: [''],
      position: ['', Validators.required],
      user_id: '',
      org_id: '',
      contact: '',
      id: '',
      user_displayname: '',
      user_username: '',
      org_name: '',
    });
  }

  dao() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page, this.searchTrigger.asObservable(), this.dialogTrigger.asObservable()).pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        return this.contactDao.getListByContribution(
          this.contributor._id.toString(),
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

  addContact() {
    this.contact.reset();
    this.orgDao.getListByContributorAll(this.cDS._id).subscribe(
      resp => {
        this.organizations = resp.result.data;
        resp.result.data.forEach(e => {
          const orgname = e.name + ' - ' + e.city + ', ' + e.province;
          this.orglist.push({ name: orgname, value: e._id.toString(), selected: false });
          this.orglist.forEach(orga => {
            orga.selected = false;
          });
          this.orglist[0].selected = true;
          $('.choose_org_con').dropdown({
            onChange: (value) => {
              if (value !== '') {
                const orgchosen = this.organizations.find(x => `${x._id}` === `${value}`);
                this.data['org_id'] = value;
                this.data['org_name'] = orgchosen['name'];
              }
            },
            values: this.orglist,
          });
          $('.ui.modal.contacts').modal({
            onApprove: function () {
              return false;
            }
          }).modal('show');
        });
      },
      err => {
        console.log(err);
      }
    );
  }

  submitContact(): void {
    $('.ui.positive.right.labeled').addClass('disabled').addClass('loading');
    this.contact.controls['user_id'].setValue(this.cDS._id);
    this.contact.controls['user_username'].setValue(this.cDS.username);
    this.contact.controls['user_displayname'].setValue(this.cDS.name);
    this.contact.controls['org_id'].setValue(this.data['org_id']);
    this.contact.controls['org_name'].setValue(this.data['org_name']);
    this.contactDao.saveCreate(this.contact.value).subscribe(data => {
      this.contact.reset();
      $('.ui.modal.contacts').modal('hide');
      $('.ui.positive.right.labeled').removeClass('disabled').removeClass('loading');
      this.dialogTrigger.next();
    });
  }

  editContact(id) {
    this.contact.reset();
    this.data['id'] = id;
    const con = this.dataSource.data.find(x => x['_id'] === id);
    this.contact.controls['position'].setValue(con['position']);
    this.contact.controls['user_id'].setValue(con['user_id']);
    this.contact.controls['id'].setValue(con['_id']);
    this.contact.controls['user_username'].setValue(con['user']['username']);
    this.contact.controls['user_displayname'].setValue(con['user']['displayname']);
    this.contact.controls['org_name'].setValue(con['org_name']);
    this.contact.controls['org_id'].setValue(con['org_id']);
    if (con['name'] === 'null') { con['name'] = ''; }
    this.contact.controls['name'].setValue(con['name']);
    this.orgDao.getListByContributorAll(this.cDS._id).subscribe(
      resp => {
        this.organizations = resp.result.data;
        resp.result.data.forEach(e => {
          const orgname = e.name + ' - ' + e.city + ', ' + e.province;
          this.orglist.push({ name: orgname, value: e._id.toString(), selected: false });
          this.orglist.forEach(orga => {
            orga.selected = `${orga.value}` === `${this.contact.controls['org_id'].value}`;
          });
          console.log(this.orglist);
          $('.choose_org_con').dropdown({
            onChange: (value) => {
              if (value !== '') {
                const orgchosen = this.organizations.find(x => `${x._id}` === `${value}`);
                this.contact.controls['org_id'].setValue(value);
              }
            },
            values: this.orglist,
          });
          $('.ui.modal.edit_contact').modal({
            onApprove: function () {
              return false;
            }
          }).modal('show');
        });
      },
      err => {
        console.log(err);
      }
    );
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

  delete() {

  }

  deleteApprove(id) {
    this.selected_contact_id = id;
    $('.delete_contact_').modal({
      onApprove: function () {
        return false;
      }
    }).modal('show');
  }

  delete_contact(id): void {
    $('.deleteapproveBtn').addClass('disabled').addClass('loading');
    this.contactDao.delete(id).subscribe(resp => {
      this.dialogTrigger.next();
      $('.delete_contact_').modal('hide');
      $('.deleteapproveBtn').removeClass('disabled').removeClass('loading');
    });
  }

  get username() {
    return this.cDS.username;
  }

  printpdf() {
    const columns = [
      { title: 'Name', dataKey: 'name' },
      { title: 'Position', dataKey: 'pos' },
      { title: 'Organization', dataKey: 'org' },
    ];
    const rows = [];
    this.dataSource.data.forEach(element => {
      rows.push({
        'name': element['name'],
        'pos': element['position'],
        'org': element['organization']['org_name'],
      });
    });
    const pdftitle = this.cDS.name + 'Contacts';
    this.print.printpdf(columns, rows, pdftitle, 'Contact list from contributor: ' + this.cDS.name + '.');
  }

}
