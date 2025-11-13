import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { EncuestaRoutingModule } from './encuesta-routing.module';
import { EncuestaComponent } from './encuesta.component';
import {NgxSpinnerModule} from 'ngx-spinner';
import {SharedModule} from '../../../theme/shared/shared.module';
import {StickyClassDirectiveModule} from '../../../shared/directive/sticky-class.directive';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {FloatButtonModule} from '../../../theme/shared/float/float.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {RespuestaTablaModule} from "./respuesta-tabla/respuesta-tabla.module";
import {RespuestaGraficoModule} from "./respuesta-grafico/respuesta-grafico.module";
import {EncuestaClientesModule} from "./encuesta-clientes/encuesta-clientes.module";


@NgModule({
  declarations: [EncuestaComponent],
  imports: [
    CommonModule,
    EncuestaRoutingModule,

    NgxSpinnerModule,
    SharedModule,
    StickyClassDirectiveModule,
    NgbTooltipModule,
    FloatButtonModule,
    MatTooltipModule,
    MatButtonModule,

    RespuestaTablaModule,
    RespuestaGraficoModule,
    EncuestaClientesModule
  ],
  exports: [EncuestaComponent],
  providers: [DatePipe],
  bootstrap: [EncuestaComponent]
})
export class EncuestaModule { }
