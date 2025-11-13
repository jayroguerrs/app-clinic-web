import {Injectable} from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {pdfConfig} from "../../app-config";
// import pdfFonts from 'src/app/shared/fonts/build/custom-fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({ providedIn: 'root' })
export class PdfmakeService {

  constructor() {
  }

  async create( body: any[], type: number = 0): Promise<any>
  {
    const dd: any = {
      info: {
        title: 'DocumentoDepilzone',
        author: 'Depilzone',
        subject: 'Sistemas',
        keywords: 'Clinic2.0'
      },
      header: {
        image: pdfConfig.cabeceraPaginaImagen,
        width: 575,
        height: 150,
        alignment: "center",
        margin: [0, 10, 0, 0]
      },
      footer: function(currentPage, pageCount, pageSize) {
        return [
          {
            image: pdfConfig.piePaginaImagen,
            width: 575,
            height: 38,
            alignment: "center",
          }
        ]
      },
      content: body,
      defaultStyle : {
        fontSize: 10,
        lineHeight: 1.5,
      },
      styles: {
        tableHeader: {
          fillColor: '#55aae0',
          fontSize: 9,
          bold: true,
          lineHeight: 1,
        },
        tableBody: {
          fontSize: 9,
          margin: 0,
          lineHeight: 1
        }
      },
      pageSize: "A4",
      pageMargins: [50,160,50,45]
    };

    switch (type) {
      case 0: break;
      case 1 : dd['watermark'] = { text: 'PREVISUALIZACIÓN', color: 'blue', opacity: 0.3, bold: true, italics: false, alignment:'left' };break;
      case 2 : dd['watermark'] = { text: 'ANULADO', color: 'red', opacity: 0.5, bold: true, italics: false };break;
    }

    return pdfMake.createPdf(dd);
  }

}
