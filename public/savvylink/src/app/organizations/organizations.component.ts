import { PrintService } from './../print.service';
import { fadeAnimation } from './../animations/fade.animation';
import { ActivatedRoute } from '@angular/router/';
import { FormService } from './../models/form.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OrganizationList } from './../models/organizations';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { config } from '../../../config/app';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables';
import { ProfileService } from '../profile.service';

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
declare var $: any;
declare var jsPDF: any;
declare var html2canvas: any;
declare var DataTables: any;

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.css'],
})
export class OrganizationsComponent implements OnInit, AfterViewInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  showactions = true;
  user: any;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  organizations = {
    results: [],
    count: 0,
    limit: 10,
    offset: 0,
    show: [],
  };
  contribution = {
    org_name: '',
    org_id: ''
  };

  organizationList = OrganizationList;
  searchform: FormGroup;
  constructor(private route: ActivatedRoute, private http: HttpClient, private print: PrintService,
    private cdr: ChangeDetectorRef, private form: FormService, private builder: FormBuilder,
    private profile: ProfileService) {

  }

  ngOnInit() {
    this.tableOptions();
    this.user = this.profile.userdata;
  }
  ngAfterViewInit() {
    this.dtTrigger.next();
    $('.print_btn').popup();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
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
    this.organizationList.forEach(element => {
      rows.push({
        'name': element['name'],
        'cty': element['city'],
        'prv': element['province'],
        'cnt': element['country'],
      });
    });

    this.print.printpdf(columns, rows, 'Organizations', 'Organization list from Savvylink');
  }
  contribute(id, name) {
    this.contribution['org_id'] = id;
    this.contribution['org_name'] = name;
    const chosen_org = this.organizationList.find(x => x['_id'] === id);
    if (chosen_org['contributors'].find(x => x['_id'] === this.user['id']) !== undefined) {
      $('#contributeModal_fail').modal('show');
    } else { this.proceedContribute(id, name); }

  }

  proceedContribute(id, name) {
    let body = new HttpParams();
    body = body.append('id', id);
    body = body.append('user_id', this.user['id']);
    body = body.append('user_username', this.user['username']);
    body = body.append('user_displayname', this.user['name']);
    try {
      this.http.put(config.orgApiEdit + '/contribute', body)
        .subscribe(resp => {
          $('#contributeModal').modal('show');
        });
    } catch (err) {
      console.log(err);
    }
  }

  tableOptions() {
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        const para = dataTablesParameters;
        let sort = 'name';
        switch (para['order'][0]['column']) {
          case 0:
            sort = 'name';
            break;
          case 1:
            sort = 'city';
            break;
          case 2:
            sort = 'province';
            break;
          case 3:
            sort = 'country';
            break;
        }
        that.http.get<DataTablesResponse>(
          config.orgApi + 'get?&limit=' + para['length'] +
          '&search=' + para['search']['value'] +
          '&offset=' + para['start'] +
          '&order=' + para['order'][0]['dir'] +
          '&sort=' + sort).subscribe(resp => {
            const results = resp['result'];
            this.organizationList = results['data'];
            callback({
              recordsTotal: results['count'],
              recordsFiltered: results['filtered'],
              data: []
            });
            this.cdr.detectChanges();
            $('.contribute_btn').popup();
          });
      }
    };
  }


}
