import { PrintService } from './../print.service';
import { Subject } from 'rxjs/Subject';
import { CurrentContributor } from './../models/currentcontributor';
import { ActivatedRoute, Route, Router, NavigationEnd } from '@angular/router';
import { OrgResponse } from './../organizationform/models/response';
import { Organization } from './../organizationform/models/organization';
import { FormService } from './../models/form.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OrganizationList } from './../models/organizations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { config } from '../../../config/app';
import { CurrentUser } from '../models/currentuser';
import { UsersService } from '../users.service';
import { DataTableDirective } from 'angular-datatables';
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
declare var $: any;
declare var DataTables: any;
@Component({
  selector: 'app-organizations-user',
  templateUrl: './organizations-user.component.html',
  styleUrls: ['./organizations-user.component.css']
})
export class OrganizationsUserComponent implements OnInit, AfterViewInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  organizations = {
    results: [],
    count: 0,
    limit: 10,
    offset: 0,
    show: [],
  };

  organizationList = OrganizationList;
  orgResponse = OrgResponse;
  user = CurrentUser;
  otherUser: any;
  searchform: FormGroup;
  orgform = this.form.organizationform;
  orgmodel = new Organization(null);
  isUser = false;

  approvemodal: Object = {
    header: null,
    text: null,
    delete_org_id: null,
  };

  contributor = CurrentContributor;



  constructor(private route: ActivatedRoute, private userService: UsersService, private router: Router,
    private http: HttpClient, private form: FormService,
    private print: PrintService, private builder: FormBuilder) {

    this.userService.WatchProfileRequest.subscribe(u => {
      // this.fetchorganizations();
      this.orgform.controls['user_id'].setValue(this.user['id']);
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
       this.initialize();
      }
    });
  }


  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.otherUser = this.route.snapshot.parent.data['thisuser']['result'][0];
    const userUsing = this.route.snapshot.parent.parent.parent.data.content;
    const content = this.route.snapshot.data.content;
    this.isUser = (userUsing['id'] === this.otherUser._id) ? true : false;
    this.tableOptions();
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
    const pdftitle = this.otherUser['name'] + '- Organizations';
    this.print.printpdf(columns, rows, pdftitle, 'Organizations being contributed by: ' + this.otherUser['name'] + '.');
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
          config.orgApiByContribution + '?user_id=' + this.otherUser['_id'] +
          '&sort=' + sort +
          '&limit=' + para['length'] +
          '&search=' + para['search']['value'] +
          '&offset=' + para['start'] +
          '&order=' + para['order'][0]['dir']).subscribe(resp => {
            const results = resp['result'];
            this.organizationList = results['data'];
            callback({
              recordsTotal: results['count'],
              recordsFiltered: results['filtered'],
              data: []
            });
          });
      }
    };
  }



  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }


  ngAfterViewInit() {
    this.dtTrigger.next();
    console.log('judererunning');
  }

  editOrg(id) {
    this.orgform.reset();
    const org = this.organizationList.find(x => x['_id'] === id);
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
      this.rerender();
    });
  }

  addOrg(): void {
    this.orgform.reset();
    $('.ui.modal.organization').modal({
      onApprove: function () {
        return false;
      }
    }).modal('show');
  }

  submitOrg(): void {
    $('.submitorg').addClass('disabled').addClass('loading');
    this.orgform.controls['user_displayname'].setValue(this.user['displayname']);
    this.orgform.controls['user_username'].setValue(this.user['username']);
    this.orgform.controls['user_id'].setValue(this.user['id']);
    const org = new Organization(this.orgform.value);
    org.send().subscribe(data => {
      $('.ui.modal.organization').modal('hide');
      $('.submitorg').removeClass('disabled').removeClass('loading');
      this.rerender();
    });
  }

  showApprove(option, id, name) {
    switch (option) {
      case 'delete':
        this.approvemodal['header'] = 'Delete organization.';
        this.approvemodal['text'] = 'Are you sure you want to remove ' + name + ' from the list?';
        this.approvemodal['delete_org_id'] = id;
        break;
    }
    $('.approval-modal-org').modal({
      onApprove: function () {
        return false;
      }
    }).modal('show');
  }

  delete(id): void {
    $('.deleteorg').addClass('disabled').addClass('loading');
    this.orgmodel.delete(id, this.user['id']).subscribe(resp => {
      this.rerender();
      $('.approval-modal-org').modal('hide');
      $('.deleteorg').removeClass('disabled').removeClass('loading');
    });
  }

  get disablebutton() { return this.orgform.valid && !this.orgResponse['HasError']; }

}
