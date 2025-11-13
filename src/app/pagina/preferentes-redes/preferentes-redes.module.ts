import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreferentesRedesRoutingModule } from './preferentes-redes-routing.module';
import { PreferentesRedesComponent } from './preferentes-redes.component';
import {SharedModule} from "../../theme/shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {FontawesomeSvgModule} from "../../componentes/fontawesome-svg/fontawesome-svg.module";
import {DataTablesModule} from "angular-datatables";
import {NgxSpinnerModule} from "ngx-spinner";
import {FlatpickrModule} from "angularx-flatpickr";


@NgModule({
  declarations: [PreferentesRedesComponent],
  imports: [
    CommonModule,
    PreferentesRedesRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    FontawesomeSvgModule,
    DataTablesModule,
    NgxSpinnerModule,
    FlatpickrModule
  ],
  exports: [PreferentesRedesComponent],
  providers: [],
  bootstrap: [PreferentesRedesComponent]
})
export class PreferentesRedesModule { }
