import { PrintService } from './../print.service';
import { DataTableDirective } from 'angular-datatables';
import { config } from './../../../config/app';
import { HttpClient } from '@angular/common/http';
import { Contact } from './../contactform/models/contact';
import { FormService } from './../models/form.service';
import { ActivatedRoute } from '@angular/router/';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Subject } from 'rxjs/Subject';
declare var $: any;
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-contacts-user-page',
  templateUrl: './contacts-user-page.component.html',
  styleUrls: ['./contacts-user-page.component.css']
})
export class ContactsUserPageComponent implements OnInit, AfterViewInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  otherUser: any;
  isUser = false;
  contactModel = new Contact(null);
  contact = this.form.contactform;
  contactlist = [];
  orglist = [];
  organizations = [];
  approvemodal: Object = {
    header: null,
    text: null,
    con_id: null,
  };

  data: Object = {
    user_id: '',
    user_displayname: '',
    user_username: '',
    org_id: '',
    org_name: '',
  };

  searchform: FormGroup;
  constructor(private builder: FormBuilder, private router: ActivatedRoute,
    private http: HttpClient, private form: FormService, private print: PrintService) {

  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  tableOptions() {
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        const para = dataTablesParameters;
        that.http.get<DataTablesResponse>(
          config.contactApiGetByUsers +
          '?user_id=' + this.data['user_id'] +
          '&limit=' + para['length'] +
          '&search=' + para['search']['value'] +
          '&offset=' + para['start'] +
          '&order=' + para['order'][0]['dir']).subscribe(resp => {
            const results = resp['result'];
            this.contactlist = results['data'];
            console.log(this.contactlist);
            callback({
              recordsTotal: results['count'],
              recordsFiltered: results['filtered'],
              data: []
            });
          });
      }
    };
  }

  ngOnInit() {
    this.otherUser = this.router.snapshot.parent.data['thisuser']['result'][0];
    const userUsing = this.router.snapshot.parent.parent.parent.data.content;
    const content = this.router.snapshot.data.content;
    this.data['user_id'] = this.otherUser['_id'];
    this.data['user_displayname'] = this.otherUser['name'];
    this.data['user_username'] = this.otherUser['username'];
    this.isUser = (userUsing['id'] === this.otherUser._id) ? true : false;
    const orgs = this.router.snapshot.data.organizations.result['data'];
    if (orgs !== null) {
      this.organizations = orgs;
      orgs.forEach(e => {
        const orgname = e.name + ' - ' + e.city + ', ' + e.province;
        this.orglist.push({ name: orgname, value: e._id });
      });
      if (this.orglist[0] !== undefined) {
        this.orglist[0]['selected'] = true;
        this.data['org_id'] = this.orglist[0]['_id'];
        this.data['org_name'] = this.orglist[0]['name'];
      }
      this.tableOptions();
    }

  }

  orgDropdown() {
    $('.choose_org_con').dropdown({
      onChange: (value) => {
        if (value !== '') {
          const orgchosen = this.organizations.find(x => x._id === value);
          this.data['org_id'] = value;
          this.data['org_name'] = orgchosen['name'];
        }
      },
      values: this.orglist,
    });
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  printpdf() {
    const columns = [
      { title: 'Name', dataKey: 'name' },
      { title: 'Position', dataKey: 'pos' },
      { title: 'Organization', dataKey: 'org' },
    ];
    const rows = [];
    this.contactlist.forEach(element => {
      rows.push({
        'name': element['name'],
        'pos': element['position'],
        'org': element['organization']['org_name'],
      });
    });
    const pdftitle = this.otherUser['name'] + 'Contacts';
    this.print.printpdf(columns, rows, pdftitle, 'Contact list from contributor: ' + this.otherUser['name'] + '.');
  }

  addContact() {
    this.orglist.forEach(orga => {
      orga.selected = false;
    });
    this.orglist[0].selected = true;
    this.orgDropdown();
    this.contact.reset();
    $('.ui.modal.contacts').modal({
      onApprove: function () {
        return false;
      }
    }).modal('show');
  }

  editContact(id) {
    const con_org_id = this.contactlist.find(co => co._id === id).org_id;
    this.orglist.forEach(orga => {
      orga.selected = false;
    });
    this.orglist.find(or => or.value === con_org_id).selected = true;
    this.orgDropdown();
    this.contact.reset();
    this.data['id'] = id;
    const con = this.contactlist.find(x => x['_id'] === id);
    this.contact.controls['position'].setValue(con['position']);
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
    this.contact.controls['user_id'].setValue(this.data['user_id']);
    this.contact.controls['user_username'].setValue(this.data['user_username']);
    this.contact.controls['user_displayname'].setValue(this.data['user_displayname']);
    this.contact.controls['org_id'].setValue(this.data['org_id']);
    this.contact.controls['id'].setValue(this.data['id']);
    this.contact.controls['org_name'].setValue(this.data['org_name']);
    const con = new Contact(this.contact.value);
    con.edit().subscribe(data => {
      this.contact.reset();
      $('.ui.modal.edit_contact').modal('hide');
      $('.ui.positive.right.labeled').removeClass('disabled').removeClass('loading');
      this.rerender();
    });
  }

  submitContact(): void {
    $('.ui.positive.right.labeled').addClass('disabled').addClass('loading');
    this.contact.controls['user_id'].setValue(this.data['user_id']);
    this.contact.controls['user_username'].setValue(this.data['user_username']);
    this.contact.controls['user_displayname'].setValue(this.data['user_displayname']);
    this.contact.controls['org_id'].setValue(this.data['org_id']);
    this.contact.controls['org_name'].setValue(this.data['org_name']);
    const con = new Contact(this.contact.value);
    con.create().subscribe(data => {
      this.contact.reset();
      $('.ui.modal.contacts').modal('hide');
      $('.ui.positive.right.labeled').removeClass('disabled').removeClass('loading');
      this.rerender();
    });
  }


  deleteApprove(id, name) {
    this.approvemodal['header'] = 'Remove contact.';
    this.approvemodal['text'] = 'Are you sure you want to remove this contact from the list?';
    this.approvemodal['con_id'] = id;
    $('.delete_contact').modal({
      onApprove: function () {
        return false;
      }
    }).modal('show');
  }

  delete(id): void {
    $('.deleteapproveBtn').addClass('disabled').addClass('loading');
    this.contactModel.delete(id).subscribe(resp => {
      this.rerender();
      $('.delete_contact').modal('hide');
      $('.deleteapproveBtn').removeClass('disabled').removeClass('loading');
    });
  }



}
