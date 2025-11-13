import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {StickyClassDirectiveModule} from "../../../shared/directive/sticky-class.directive";
import {NgxSpinnerModule} from "ngx-spinner";
import {SharedModule} from "../../../theme/shared/shared.module";
import {VentasRoutingModule} from "./ventas-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DataTablesModule} from "angular-datatables";
import {IonicModule} from "@ionic/angular";
import { VentasComponent } from './ventas.component';
import {Top10ZonasAtendidasModule} from "./VentaComponentes/top10-zonas-atendidas/top10-zonas-atendidas.module";
import {VentasRangoModule} from "./VentaComponentes/ventas-rango/ventas-rango.module";
import {CitasAgendadasModule} from "./VentaComponentes/citas-agendadas/citas-agendadas.module";
import {CitasAtendidasModule} from "./VentaComponentes/citas-atendidas/citas-atendidas.module";
import {CitasAgendadasCortesiaModule} from "./VentaComponentes/citas-agendadas-cortesia/citas-agendadas-cortesia.module";
import {Top10ZonasPackAtendidasModule} from "./VentaComponentes/top10-zonas-pack-atendidas/top10-zonas-pack-atendidas.module";
import {ZonasAtendidasModule} from "./VentaComponentes/zonas-atendidas/zonas-atendidas.module";


@NgModule({
  declarations: [VentasComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    DataTablesModule,
    FormsModule,
    IonicModule,
    VentasRoutingModule,
    StickyClassDirectiveModule,
    NgxSpinnerModule,

    Top10ZonasAtendidasModule,
    Top10ZonasPackAtendidasModule,
    VentasRangoModule,
    CitasAgendadasModule,
    CitasAtendidasModule,
    CitasAgendadasCortesiaModule,
    ZonasAtendidasModule
  ],
  exports: [VentasComponent],
  providers:[],
  bootstrap: [VentasComponent]
})
export class VentasModule { }
