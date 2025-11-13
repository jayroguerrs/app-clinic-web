import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import { FontawesomeSvgModule } from '../../fontawesome-svg/fontawesome-svg.module';
import {MdlBuscarPreferenteComponent} from "./mdl-buscar-preferente.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FlatpickrModule} from "angularx-flatpickr";
import {MatRippleModule} from "@angular/material/core";
import {DataTablesModule} from "angular-datatables";
import {NgbDropdownModule} from "@ng-bootstrap/ng-bootstrap";
@NgModule({
  imports: [
    CommonModule,
    MatProgressBarModule,
    FontawesomeSvgModule,
    FlatpickrModule,
    ReactiveFormsModule,
    FormsModule,
    MatRippleModule,
    DataTablesModule,
    NgbDropdownModule
  ],
  declarations: [
      MdlBuscarPreferenteComponent,
  ],
  exports: [MdlBuscarPreferenteComponent],
  providers: [],
  bootstrap: [MdlBuscarPreferenteComponent]

})
export class MdlBuscarPreferenteModule { }
