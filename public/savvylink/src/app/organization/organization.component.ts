import { PrintService } from './../print.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Subject';
import { fadeAnimation } from './../animations/fade.animation';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CurrentUser } from './../models/currentuser';
import { User } from './../models/user';
import { ActivatedRoute } from '@angular/router';
import { FormService } from './../models/form.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { config } from '../../../config/app';
import { CurrentOrganization } from '../models/currentorganization';
import { OrganizationService } from '../organization.service';
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

declare var $: any;
@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css'],
})
export class OrganizationComponent implements OnInit, AfterViewInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  contribution = {
    org_id: '',
    org_name: '',
  };

  user = CurrentUser;
  orgid: string;
  org: any;
  contacts: any;
  searchform: FormGroup;
  constructor(private builder: FormBuilder, private form: FormService, private print: PrintService,
    private route: ActivatedRoute, private http: HttpClient, private orgService: OrganizationService) {
  }

  ngOnInit() {
    this.org = this.route.snapshot.data.content.result[0];
    console.log(this.route.snapshot);
    this.tableOptions();
    this.contribution['org_id'] = this.org['_id'];
    this.contribution['org_name'] = this.org['name'];
  }

  fetchorgs() {
    this.orgService.getOrgDetails(this.org['_id'], null).subscribe(resp => {
      this.org = resp['result'][0];
    });
  }

  ngAfterViewInit() {
    this.dtTrigger.next();

  }


  printpdf() {
    const columns = [
      { title: 'Position', dataKey: 'pos' },
      { title: 'Name', dataKey: 'name' },
      { title: 'Contributor', dataKey: 'contributor' }
    ];
    const rows = [];
    this.contacts.forEach(element => {
      rows.push({
        'pos': element['position'],
        'name': element['name'],
        'contributor': element['user']['displayname'],
      });
    });

    const pdftitle = this.org['name'] + ' Contacts';
    this.print.printpdf(columns, rows, pdftitle, 'Contact list from  ' + this.org['name'] + '.');
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
            sort = 'position';
            break;
        }
        that.http.get<DataTablesResponse>(
          config.contactApiGetByOrg + '?org_id=' + this.org['_id'] +
          '&sort=' + sort +
          '&limit=' + para['length'] +
          '&search=' + para['search']['value'] +
          '&offset=' + para['start'] +
          '&order=' + para['order'][0]['dir']).subscribe(resp => {
            const results = resp['result'];
            this.contacts = results['data'];
            callback({
              recordsTotal: results['count'],
              recordsFiltered: results['filtered'],
              data: []
            });
          });
      }
    };
  }

  contribute(id, name) {
    this.contribution['org_id'] = id;
    this.contribution['org_name'] = name;
    if (this.org['contributors'].find(x => x['_id'] === this.user['id']) !== undefined) {
      $('#contributeModal_fail').modal('show');
    } else { this.proceedContribute(id, name); }

  }

  proceedContribute(id, name) {
    let body = new HttpParams();
    body = body.append('id', id);
    body = body.append('user_id', this.user['id']);
    body = body.append('user_username', this.user['username']);
    body = body.append('user_displayname', this.user['displayname']);
    try {
      this.http.put(config.orgApiEdit + '/contribute', body)
        .subscribe(resp => {
          $('#contributeModal').modal('show');
          this.fetchorgs();
        });
    } catch (err) {
      console.log(err);
    }
  }

}
