export class Page{
  info: PageInfo = {
    title : 'DocumentoDepilzone',
    author : 'Depilzone',
    subject : 'Sistemas',
    keywords : 'Clinic2.0'
  };
  header: PageHeader | null = null;
  footer: PageFooter | null = null;
  content: any[] = [];
  defaultStyle = {
    // font: 'Arial'
  };
  styles = {};
  pageSize: string = 'A4';
  pageMargins: number[];
  watermark: any;
  constructor() {
  }
}

export class PageInfo{
  title: string;
  author: string;
  subject: string;
  keywords: string;
  constructor() {
  }
}

export class PageHeader{
    image: string;
    width: number;
    height: number;
    alignment: string;
}

export class PageFooter{
    image: string;
    width:  number;
    height: number;
    alignment: string;
    margin: number[];
}

export class PageBlock{
  text: string | [string,PageBlock];
  fontSize: number = 12;
  order: number;
  bold: boolean = false;
  margin: number[] = [0,0,0,0];
}
