import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ngforReverse'
})
export class NgforReversePipe implements PipeTransform {

  transform(value): unknown {
    return value.slice().reverse();
  }

}
