import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { TipoComprobanteRoutingModule} from './tipo-comprobante-routing.module';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TipoComprobanteListadoComponent } from './tipo-comprobante-listado/tipo-comprobante-listado.component';
import { TipoComprobanteDatosComponent } from './tipo-comprobante-datos/tipo-comprobante-datos.component';
import {NgxSpinnerModule} from "ngx-spinner";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        DataTablesModule,
        FormsModule,
        IonicModule,
        TipoComprobanteRoutingModule,
        NgbTooltipModule,
        NgxSpinnerModule,

        MatIconModule,
        MatListModule,
        MatButtonModule,
        MatBottomSheetModule
    ],
    declarations: [
        TipoComprobanteListadoComponent,
        TipoComprobanteDatosComponent
    ]
})
export class TipoComprobanteModule { }
