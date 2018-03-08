import { PrintService } from './../print.service';
import { config } from './../../../config/app';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
declare var jsPDF: any;
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit, AfterViewInit {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  contactlist = [];
  constructor(private http: HttpClient, private print: PrintService) { }

  ngOnInit() {
    this.tableOptions();
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
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
          config.contactApiGet + '?' +
          'limit=' + para['length'] +
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
    const pdftitle = ' - Contacts';
    this.print.printpdf(columns, rows, pdftitle, 'Contact list from Savvylink.');
  }

}
