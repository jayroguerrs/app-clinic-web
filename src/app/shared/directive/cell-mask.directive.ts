import { Directive, HostListener, Input, NgModule } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCellMask]'
})
export class CellMaskDirective {
  @Input() pais?: string = '';
  constructor(public ngControl: NgControl
  ) { }
  
  @HostListener('ngModelChange', ['$event'])
  onModelChange(event) {
    this.onInputChange(event, false);
  }

  @HostListener('keydown.backspace', ['$event'])
  keydownBackspace(event) {
    this.onInputChange(event.target.value, true);
  }

  onInputChange(event, backspace) {
    let newVal = event.replace(/\D/g, '');

    if(this.pais == '51') {
      
      if (backspace && newVal.length <= 6) {
        newVal = newVal.substring(0, newVal.length - 1);
      }
      if (newVal.length === 0) {
        newVal = '';
      } else if (newVal.length <= 1) {
        newVal = newVal.replace(/[0-8](\d{0,1})/, '$1');  
      } else if (newVal.length <= 9) {
        newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,3})/, '$1 $2 $3');
      } else {
        newVal = newVal.substring(0, 9);
        newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,3})/, '$1 $2 $3');
      }
    } else {
      if (backspace && newVal.length <= 6) {
        newVal = newVal.substring(0, newVal.length - 1);
      }
      if (newVal.length === 0) {
        newVal = '';
      } else if (newVal.length <= 12) {
        newVal = newVal.replace(/^(\d{0,12})/, '$1');
      } else {
        newVal = newVal.substring(0, 12);
        newVal = newVal.replace(/^(\d{0,12})/, '$1');
      }
    }

    this.ngControl.valueAccessor.writeValue(newVal);
  }
}

@NgModule({
  declarations: [ CellMaskDirective ],
  exports: [ CellMaskDirective ]
})

export class CellMaskDirectiveModule {}