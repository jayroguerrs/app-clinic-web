import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputDialerComponent } from './input-dialer.component';
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";



@NgModule({
  declarations: [
    InputDialerComponent
  ],
  imports: [
    CommonModule,
    NgbTooltipModule
  ],
  exports: [
    InputDialerComponent
  ],
  providers: [],
  bootstrap: [InputDialerComponent]
})
export class InputDialerModule { }
