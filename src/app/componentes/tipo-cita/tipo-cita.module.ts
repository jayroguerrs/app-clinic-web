import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { TipoCitaDatosComponent } from './tipo-cita-datos/tipo-cita-datos.component'
import { TipoCitaListadoComponent } from './tipo-cita-listado/tipo-cita-listado.component';
import { TipoCitaRoutingModule } from './tipo-cita-routing.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MatListModule} from "@angular/material/list";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TipoCitaRoutingModule,
        SharedModule,
        DataTablesModule,
        NgbTooltipModule,
        NgxSpinnerModule,

        MatListModule,
        MatBottomSheetModule,
        DragDropModule,
        MatButtonModule,
        MatIconModule
    ],
    declarations: [
        TipoCitaListadoComponent ,
        TipoCitaDatosComponent
    ]
})
export class TipoCitaModule { }
