import { Router } from '@angular/router';
import { Profile } from './../../../../model/profile';
import { PrintService } from './../../../services/print.service';
import { UserdataService } from './../../../services/userdata.service';
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
declare var $: any;
@Component({
  selector: 'app-organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.scss']
})
export class OrganizationListComponent implements OnInit, AfterViewInit {
  displayedColumns = ['actions', 'name', 'city', 'province', 'country'];
  dataSource = new MatTableDataSource();
  resultsLength = 0;
  isLoadingResults = true;
  profile: Profile;
  @ViewChild('paginator')
  private paginator: MatPaginator;
  @ViewChild(MatSort)
  private sort: MatSort;
  searchTrigger: BehaviorSubject<any> = new BehaviorSubject<any>('');
  dialogTrigger: Subject<any> = new Subject<any>();
  mess = 'You have been added to the contributor list of';
  contribution = {
    org_name: '',
    org_id: ''
  };
  constructor(private router: Router, private orgDao: OrganizationDao, private http: HttpClient, private userDS: UserdataService, private print: PrintService) { }

  ngOnInit() {
    this.profile = this.userDS.profile;
  }

  ngAfterViewInit() {
    this.dao();
  }

  dao() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page, this.searchTrigger.asObservable(), this.dialogTrigger.asObservable()).pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        return this.orgDao.getListAll(
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

  isContributor(contributors: ContributorExtra[]) {
    return contributors.findIndex(con => parseInt(con._id, 10) === this.userDS.id) !== -1;
  }

  contribute(id, name) {
    this.contribution['org_id'] = id;
    this.contribution['org_name'] = name;
    this.orgDao.contributeToOrg(id, this.userDS.id.toString(), this.userDS.username, this.userDS.name).subscribe((val) => {
      if (val['success'] === true) {
        this.mess = 'You have been added to the contributor list of';
      } else {
        this.mess = 'You are already a contributor of';
      }
      $('#contributeModal').modal('show');
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

    this.print.printpdf(columns, rows, 'Organizations', 'Organization list from Savvylink');
  }

  manage() {
    const req_url = `/contributions/${this.profile.username}`;
    $('#contributeModal').modal('hide');
    this.router.navigateByUrl(req_url);
  }
}
