import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClienteCumpleaniosRoutingModule } from './cliente-cumpleanios-routing.module';
import { ClienteCumpleaniosComponent } from './cliente-cumpleanios.component';
import {SharedModule} from "../../theme/shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {FontawesomeSvgModule} from "../../componentes/fontawesome-svg/fontawesome-svg.module";
import {DataTablesModule} from "angular-datatables";
import {NgxSpinnerModule} from "ngx-spinner";
import {FlatpickrModule} from "angularx-flatpickr";

@NgModule({
  declarations: [ClienteCumpleaniosComponent],
  imports: [
    CommonModule,
    ClienteCumpleaniosRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    FontawesomeSvgModule,
    DataTablesModule,
    NgxSpinnerModule,
    FlatpickrModule
  ],
  exports: [ClienteCumpleaniosComponent],
  providers: [],
  bootstrap: [ClienteCumpleaniosComponent]
})
export class ClienteCumpleaniosModule { }
