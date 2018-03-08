import { PrintService } from './../print.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Subject';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Organization } from './../organizationform/models/organization';
import { HttpClient } from '@angular/common/http';
import { ContactList } from './../models/contacts';
import { Contact } from './../contactform/models/contact';
import { FormService } from './../models/form.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { config } from '../../../config/app';

declare var jQuery: any;
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

declare var $: any;
@Component({
  selector: 'app-contacts-user',
  templateUrl: './contacts-user.component.html',
  styleUrls: ['./contacts-user.component.css']
})
export class ContactsUserComponent implements OnInit, AfterViewInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  contact = this.form.contactform;
  contactlist = [];
  searchform: FormGroup;
  contactModel = new Contact(null);
  orgmodel = new Organization(null);
  approvemodal: Object = {
    header: null,
    text: null,
    con_id: null,
  };
  isUser = false;
  currentUser: any;
  otherUser: any;
  data: Object = {
    user_id: '',
    user_username: '',
    user_displayname: '',
    org_id: '',
    org_name: '',
    id: '',
  };
  constructor(private builder: FormBuilder, private router_: Router, private print: PrintService,
    private router: ActivatedRoute, private form: FormService, private http: HttpClient) {

  }

  ngOnInit() {
    this.otherUser = this.router.snapshot.parent.data['thisuser']['result'][0];
    const contri = this.router.snapshot.data.content.result[0].user_id;
    const user = this.router.snapshot.parent.parent.parent.data.content;
    const org = this.router.snapshot.data.content.result[0];
    const contributor = org['contributors'].find(x => x['_id'] === user['id']);
    this.isUser = (this.otherUser['_id'] === user['id']) ? true : false;
    this.currentUser = user;
    this.data['user_id'] = user.id;
    this.data['org_id'] = org._id;
    this.data['user_username'] = user.username;
    this.data['user_displayname'] = user.name;
    this.data['org_name'] = org.name;
    this.tableOptions();
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  printpdf() {
    const columns = [
      { title: 'Name', dataKey: 'name' },
      { title: 'Position', dataKey: 'pos' },
    ];
    const rows = [];
    this.contactlist.forEach(element => {
      rows.push({
        'name': element['name'],
        'pos': element['position'],
      });
    });
    const pdftitle = this.otherUser['name'] + ' - ' + this.data['org_name'] + ' - Contacts';
    this.print.printpdf(columns, rows, pdftitle, 'Contact list from ' + this.data['org_name'] + ' contributed by ' + this.otherUser['name']);
  }

  editContact(id) {
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
    this.contact.controls['org_id'].setValue(this.data['org_id']);
    this.contact.controls['id'].setValue(this.data['id']);
    this.contact.controls['user_username'].setValue(this.data['user_username']);
    this.contact.controls['user_displayname'].setValue(this.data['user_displayname']);
    this.contact.controls['org_name'].setValue(this.data['org_name']);

    const con = new Contact(this.contact.value);
    con.edit().subscribe(data => {
      this.contact.reset();
      $('.ui.modal.edit_contact').modal('hide');
      $('.ui.positive.right.labeled').removeClass('disabled').removeClass('loading');
      this.rerender();
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
    this.contact.controls['user_id'].setValue(this.data['user_id']);
    this.contact.controls['org_id'].setValue(this.data['org_id']);
    this.contact.controls['user_username'].setValue(this.data['user_username']);
    this.contact.controls['user_displayname'].setValue(this.data['user_displayname']);
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
          config.contactApiGetByOrg + '/contribution?org_id=' + this.data['org_id'] +
          '&user_id=' + this.otherUser['_id'] +
          '&limit=' + para['length'] +
          '&search=' + para['search']['value'] +
          '&offset=' + para['start'] +
          '&order=' + para['order'][0]['dir']).subscribe(resp => {
            const results = resp['result'];
            this.contactlist = results['data'];
            callback({
              recordsTotal: results['count'],
              recordsFiltered: results['filtered'],
              data: []
            });
          });
      }
    };
  }

}
