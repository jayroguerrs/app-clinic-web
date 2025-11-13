import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../theme/shared/shared.module';
import { IonicModule } from '@ionic/angular';
import {StickyClassDirectiveModule} from "../../../shared/directive/sticky-class.directive";
import {NgxSpinnerModule} from "ngx-spinner";
import {FloatButtonModule} from "../../../theme/shared/float/float.module";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonModule} from "@angular/material/button";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {EspecialistaItemModule} from "../EspecialistaAtendidos/EspecialistaItem/especialista-item.module";
import {MatRippleModule} from "@angular/material/core";
import {AutocompleteSelectModule} from "../../../shared/components/autocomplete-select/autocomplete-select.module";
import {FontawesomeSvgModule} from "../../fontawesome-svg/fontawesome-svg.module";
import {TblCitaDetalleReporteAgendadoModule} from "./tbl-cita-detalle-reporte-agendado/tbl-cita-detalle-reporte-agendado.module";
import {CitaDetalleReporteAgendadoRoutingModule} from "./cita-detalle-reporte-agendado-routing.module";
import {CitaDetalleReporteAgendadoComponent} from "./cita-detalle-reporte-agendado.component";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        CitaDetalleReporteAgendadoRoutingModule,
        StickyClassDirectiveModule,
        NgxSpinnerModule,
        FloatButtonModule,
        NgbTooltipModule,
        MatIconModule,
        MatTooltipModule,
        MatButtonModule,
        EspecialistaItemModule,
        AutocompleteSelectModule,
        TblCitaDetalleReporteAgendadoModule,
        MatRippleModule,
        FontawesomeSvgModule
    ],
    declarations: [CitaDetalleReporteAgendadoComponent ],
    providers: [],
    exports: [CitaDetalleReporteAgendadoComponent]
})
export class CitaDetalleReporteAgendadoModule { }
