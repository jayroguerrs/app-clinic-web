import { Directive, HostListener, Input, NgModule } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appDNIMask]'
})
export class DniMaskDirective {
  @Input() tipoDocumento?: string = '0';
  constructor(public ngControl: NgControl
  ) { }
  
  @HostListener('ngModelChange', ['$event'])
  onModelChange(event) {
    this.onInputChange(event);
  }

  onInputChange(event) {
    let newVal = event.replace(/\D/g, '');

    switch(this.tipoDocumento) {
      case '1': { 
        if (newVal.length === 0) {
          newVal = '';
        } else if (newVal.length <= 8) {
          newVal = newVal.replace(/^(\d{0,8})/, '$1');
        } else {
          newVal = newVal.substring(0, 8);
          newVal = newVal.replace(/^(\d{0,3})/, '$1');
        }
        break;
      }
      case '2': 
      case '3': {
        if (newVal.length === 0) {
          newVal = '';
        } else if (newVal.length <= 12) {
          newVal = newVal.replace(/^(\d{0,8})/, '$1');
        } else {
          newVal = newVal.substring(0, 12);
          newVal = newVal.replace(/^(\d{0,3})/, '$1');
        }
        break;
      }
      default: {
        newVal = '';
        const action = 'enable';
        this.ngControl.control[action]();
      }
    }
    this.ngControl.valueAccessor.writeValue(newVal);
  }
}

@NgModule({
  declarations: [ DniMaskDirective ],
  exports: [ DniMaskDirective ]
})

export class DniMaskDirectiveModule {}