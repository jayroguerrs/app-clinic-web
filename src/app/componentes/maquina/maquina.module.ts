import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables'
import { MaquinaRoutingModule } from './maquina-routing.module';
import { MaquinaListadoComponent } from './maquina-listado/maquina-listado.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MaquinaDatosComponent } from './maquina-datos/maquina-datos.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {ColorPickerModule} from "ngx-color-picker";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MaquinaRoutingModule,
        SharedModule,
        DataTablesModule,
        NgbTooltipModule,
        NgxSpinnerModule,

        MatListModule,
        MatBottomSheetModule,
        DragDropModule,
        MatButtonModule,
        MatIconModule,
        ColorPickerModule
    ],
    declarations: [
        MaquinaListadoComponent,
        MaquinaDatosComponent
    ]
})
export class MaquinaModule { }
