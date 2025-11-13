import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClienteGenerarCitaRoutingModule } from './cliente-generar-cita-routing.module';
import { ClienteGenerarCitaComponent } from './cliente-generar-cita.component';
import {NgxSpinnerModule} from "ngx-spinner";
import {SharedModule} from "../../theme/shared/shared.module";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";


@NgModule({
  declarations: [ClienteGenerarCitaComponent],
  imports: [
    CommonModule,
    ClienteGenerarCitaRoutingModule,
    NgxSpinnerModule,
    SharedModule,
    NgbTooltipModule,
    MatRippleModule
  ],
  exports: [ClienteGenerarCitaComponent],
  providers: [],
  bootstrap: [ClienteGenerarCitaComponent]
})
export class ClienteGenerarCitaModule { }
