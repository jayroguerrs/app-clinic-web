import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {SharedModule} from "../../../theme/shared/shared.module";
import {FloatButtonModule} from "../../../theme/shared/float/float.module";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {DataTablesModule} from "angular-datatables";
import {NgxSpinnerModule} from "ngx-spinner";
import {StickyClassDirectiveModule} from "../../../shared/directive/sticky-class.directive";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";

import {PromocionRankingModule} from "./VentasPromocionComponentes/promocion-ranking/promocion-ranking.module";

import {PromocionRankingVentasComponent} from "./promocion-ranking-ventas.component";
import {PromocionRankingVentasRoutingModule} from "./promocion-ranking-ventas-routing.module";
import {PromocionVentasRangoModule} from "./VentasPromocionComponentes/promocion-ventas-rango/promocion-ventas-rango.module";
import {PromocionTop10ZonasModule} from "./VentasPromocionComponentes/promocion-top10-zonas/promocion-top10-zonas.module";
import {PromocionBottom10ZonasModule} from "./VentasPromocionComponentes/promocion-bottom10-zonas/promocion-bottom10-zonas.module";
import {PromocionZonasRankingModule} from "./VentasPromocionComponentes/promocion-zonas-ranking/promocion-zonas-ranking.module";

import {PromocionAgendadosRangoModule} from "./VentasPromocionComponentes/promocion-agendados-rango/promocion-agendados-rango.module";
import {PromocionAtendidosRangoModule} from "./VentasPromocionComponentes/promocion-atendidos-rango/promocion-atendidos-rango.module";



@NgModule({
  declarations: [ PromocionRankingVentasComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    DataTablesModule,
    FormsModule,
    IonicModule,
    PromocionRankingVentasRoutingModule,

    SharedModule,
    FloatButtonModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    NgbTooltipModule,
    DataTablesModule,
    NgxSpinnerModule,
    StickyClassDirectiveModule,

    PromocionVentasRangoModule,
    PromocionAgendadosRangoModule,
    PromocionAtendidosRangoModule,

    PromocionRankingModule,
    PromocionVentasRangoModule,

    PromocionTop10ZonasModule,
    PromocionBottom10ZonasModule,
    PromocionZonasRankingModule
  ]
})
export class PromocionRankingVentasModule { }
