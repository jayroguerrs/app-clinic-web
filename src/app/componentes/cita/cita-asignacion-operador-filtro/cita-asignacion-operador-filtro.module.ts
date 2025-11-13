import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {CommonModule, DatePipe} from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import {MAT_DATE_LOCALE, MatRippleModule} from '@angular/material/core';
import {CitaAsignacionOperadorFiltroComponent} from "./cita-asignacion-operador-filtro.component";
import {NgxSpinnerModule} from "ngx-spinner";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {SharedModule} from "../../../theme/shared/shared.module";
import {FlatpickrModule} from "angularx-flatpickr";


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DataTablesModule,
        FormsModule,
        IonicModule,
        NgxSpinnerModule,
        MatRippleModule,
        NgbTooltipModule,
        SharedModule,
        FlatpickrModule
    ],
    exports: [
        CitaAsignacionOperadorFiltroComponent
    ],
    declarations: [
      CitaAsignacionOperadorFiltroComponent
    ],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-ES' }, DatePipe]
})
export class CitaAsignacionOperadorFiltroModule { }
