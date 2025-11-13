import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupButtonComponent } from './group-button.component';
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";



@NgModule({
  declarations: [
    GroupButtonComponent
  ],
  imports: [
    CommonModule,
    NgbTooltipModule
  ],
  exports: [
    GroupButtonComponent
  ],
  providers: [],
  bootstrap: [GroupButtonComponent]
})
export class GroupButtonModule { }
