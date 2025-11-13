import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RespuestaGraficoComponent } from './respuesta-grafico.component';
import {ChartModule} from "angular2-chartjs";


@NgModule({
  declarations: [RespuestaGraficoComponent],
  imports: [
    CommonModule,
    ChartModule
  ],
  exports: [RespuestaGraficoComponent],
  providers: [],
  bootstrap: [RespuestaGraficoComponent]
})
export class RespuestaGraficoModule {

}
