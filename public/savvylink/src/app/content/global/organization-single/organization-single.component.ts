import { Router } from '@angular/router/';
import { PrintService } from './../../../services/print.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OrganizationDao } from './../../../../dao/organization';
import { ContributorExtra, UserExtra } from './../../../../model/extras';
import { Profile } from './../../../../model/profile';
import { UserdataService } from './../../../services/userdata.service';
import { Organization } from './../../../../model/organization';
import { OrganizationdataService } from './../../../services/organizationdata.service';
import { ActivatedRoute } from '@angular/router';
import { ContactListResponse, Contact } from './../../../../model/contact';
import { ContactDao } from './../../../../dao/contact';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
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
declare var $: any;
@Component({
  selector: 'app-organization-single',
  templateUrl: './organization-single.component.html',
  styleUrls: ['./organization-single.component.scss']
})
export class OrganizationSingleComponent implements OnInit, AfterViewInit {
  org: Organization;
  profile: Profile;
  displayedColumns = ['con.ContactPosition', 'con.ContactName', 'u.UserGivenName'];
  dataSource = new MatTableDataSource();
  resultsLength = 0;
  isLoadingResults = true;

  @ViewChild('paginator')
  private paginator: MatPaginator;
  @ViewChild(MatSort)
  private sort: MatSort;
  searchTrigger: BehaviorSubject<any> = new BehaviorSubject<any>('');
  dialogTrigger: Subject<any> = new Subject<any>();

  contribution = {
    org_name: '',
    org_id: ''
  };


  constructor(
    private contactDao: ContactDao, private orgDS: OrganizationdataService,
    private route: ActivatedRoute, private userDS: UserdataService,
    private orgDao: OrganizationDao, private builder: FormBuilder,
    private print: PrintService, private router: Router
  ) { }

  ngAfterViewInit() {
    this.dao();
  }

  dao() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page, this.searchTrigger.asObservable(), this.dialogTrigger.asObservable()).pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        return this.contactDao.getListByOrg(
          this.org_id.toString(),
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


  ngOnInit() {
    this.initializeData(this.route.snapshot.data.content['result'][0]);
  }

  initializeData(orgdata) {
    this.orgDS.setData(orgdata);
    this.org = this.orgDS._organization;
    this.profile = this.userDS.profile;
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


  isContributor() {
    return this.contributors.findIndex(con => parseInt(con._id, 10) === this.userDS.id) !== -1;
  }

  contribute(id, name) {
    this.contribution['org_id'] = id;
    this.contribution['org_name'] = name;
    this.orgDao.contributeToOrg(id, this.userDS.id.toString(), this.userDS.username, this.userDS.name).subscribe(() => {
      this.orgDao.getByID(id).subscribe(resp => {
        this.initializeData(resp.result[0]);
        $('#contributeModal_').modal('show');
        this.dialogTrigger.next();
      });
    });
  }

  printpdf() {
    const columns = [
      { title: 'Position', dataKey: 'pos' },
      { title: 'Name', dataKey: 'name' },
      { title: 'Contributor', dataKey: 'contributor' }
    ];
    const rows = [];
    this.dataSource.data.forEach(element => {
      rows.push({
        'pos': element['position'],
        'name': element['name'],
        'contributor': element['user']['displayname'],
      });
    });

    const pdftitle = this.org['name'] + ' Contacts';
    this.print.printpdf(columns, rows, pdftitle, 'Contact list from  ' + this.org['name'] + '.');
  }

  manage() {
    const req_url = `/contributions/${this.profile.username}`;
    $('#contributeModal_').modal('hide');
    this.router.navigateByUrl(req_url);
  }


}
