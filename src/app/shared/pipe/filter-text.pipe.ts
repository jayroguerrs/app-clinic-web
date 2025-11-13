import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filterText'
})
export class FilterTextPipe implements PipeTransform {
  transform(items: any[], textBuscar: string): any[] {
    if(!items) return [];
    if(!textBuscar) return items;
    
    textBuscar = textBuscar.toLowerCase();
        return items.filter( it => {
          return (it.descripcion + ' - ' + it.genero).toLowerCase().includes(textBuscar);
        });
   } 
}