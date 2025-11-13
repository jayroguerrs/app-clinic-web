import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreferenteEstadoRoutingModule } from './preferentes-estado-routing.module';
import { PreferenteEstadoComponent } from './preferentes-estado.component';
import {SharedModule} from "../../theme/shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {FontawesomeSvgModule} from "../../componentes/fontawesome-svg/fontawesome-svg.module";
import {DataTablesModule} from "angular-datatables";
import {NgxSpinnerModule} from "ngx-spinner";
import {FlatpickrModule} from "angularx-flatpickr";

@NgModule({
  declarations: [PreferenteEstadoComponent],
  imports: [
    CommonModule,
    PreferenteEstadoRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    FontawesomeSvgModule,
    DataTablesModule,
    NgxSpinnerModule,
    FlatpickrModule
  ],
  exports: [PreferenteEstadoComponent],
  providers: [],
  bootstrap: [PreferenteEstadoComponent]
})
export class PreferenteEstadoModule { }
