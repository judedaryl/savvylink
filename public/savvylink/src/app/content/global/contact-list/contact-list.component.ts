import { PrintService } from './../../../services/print.service';
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

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit, AfterViewInit {
  displayedColumns = ['con.ContactPosition', 'con.ContactName', 'org.OrganizationName', 'u.UserGivenName'];
  dataSource = new MatTableDataSource();
  resultsLength = 0;
  isLoadingResults = true;

  @ViewChild('paginator')
  private paginator: MatPaginator;
  @ViewChild(MatSort)
  private sort: MatSort;
  searchTrigger: BehaviorSubject<any> = new BehaviorSubject<any>('');
  dialogTrigger: Subject<any> = new Subject<any>();

  constructor(private contactDao: ContactDao, private print: PrintService) { }
  ngOnInit() {

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
        return this.contactDao.getList(
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
    const pdftitle = ' - Contacts';
    this.print.printpdf(columns, rows, pdftitle, 'Contact list from Savvylink.');
  }

}
