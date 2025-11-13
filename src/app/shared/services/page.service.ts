import { Injectable } from '@angular/core';

import {PageBlock} from "../models/page";

@Injectable({ providedIn: 'root' })
export class PageService {

    constructor(

    ) {
    }

    obtenerBloquesOfPdf( bloques: any[]): PageBlock[]{
      const blocks: PageBlock[] = [];
      bloques.forEach((b, i)=> {
        if(b.text instanceof Array){
          let text = '';
          b.text.forEach((sb) => {

            if(typeof sb == 'object'){
              text += ' ' + sb.text;
            }else{
              text += ' ' + sb;
            }
          });
          blocks.push({ text: text, order: i, fontSize: 10, margin: [ 60, 15 , 50, 10], bold: false });
        }else{
          blocks.push({ text: b.text, order: i, fontSize: 10, margin: [ 60, 15 , 50, 10], bold: false });
        }
      });
      return blocks;
    }

  convertirBloquesAHtml( bloques: PageBlock[]): string{
    let HTML: string = '';
    bloques.forEach((block) => {
      HTML += (`<p>${block.text}</p>`).replace('> <','><').replace('<br>','');
    });
    return HTML;
  }

}
