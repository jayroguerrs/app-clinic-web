import { NgControl } from '@angular/forms';
import {Directive, Input} from "@angular/core";

@Directive({
  selector: '([formControl],[formControlName])[disableControl]',
})
export class DisableControlDirective {
  @Input('disableControl') disableControl;
  constructor(private ngControl: NgControl) {}

  ngOnChanges(changes) {
    if (changes['disableControl']) {
      const action = this.disableControl ? 'disable' : 'enable';

      this.ngControl.control[action]();
    }
  }
}
