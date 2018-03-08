import { SavvyLogo } from './models/savvylogo';
import { Injectable } from '@angular/core';
declare var jsPDF: any;
@Injectable()
export class PrintService {

  constructor() { }

  printpdf(column, row, from, description?) {

    if (description === undefined || description === null) { description = ''; }
    const doc = new jsPDF('p', 'mm', [216, 279]);
    const totalPagesExp = '{total_pages_count_string}';

    doc.setFontSize(23);
    doc.addImage(SavvyLogo, 'JPEG', 20, 12, 15, 15);
    doc.text(35, 22, 'Savvylinks');
    doc.setFontSize(12);
    doc.setFontType('normal');
    doc.text(20, 60, description);


    const pageContent = function (data) {

      // FOOTER
      let str = 'Page ' + data.pageCount;
      // Total page number plugin only available in jspdf v1.0+
      if (typeof doc.putTotalPages === 'function') {
        str = str + ' of ' + totalPagesExp;
      }
      doc.setFontSize(10);
      doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 10);
    };


    doc.autoTable(column, row, {
      addPageContent: pageContent,
      theme: 'grid',
      headerStyles: {
        fillColor: [251, 189, 8],
      },
      styles: {

        fontSize: 10,
        font: 'helvetica', // helvetica, times, courier
        lineColor: 200,
        fontStyle: 'normal', // normal, bold, italic, bolditalic
        overflow: 'ellipsize', // visible, hidden, ellipsize or linebreak
        textColor: 20,
        halign: 'left', // left, center, right
        valign: 'middle', // top, middle, bottom
        columnWidth: 'auto' // 'auto', 'wrap' or a number

      },
      margin: { top: 70, right: 20, left: 20 }

    });

    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPagesExp);
    }

    const date = this.getdate();
    doc.save('Savvylink-' + from + '' + date);
  }

  private getdate() {
    const today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; // January is 0!

    const yyyy = today.getFullYear();
    if (dd < 10) {
      dd = 0 + dd;
    }
    if (mm < 10) {
      mm = 0 + mm;
    }
    return dd + '' + mm + '' + yyyy;
  }
}
