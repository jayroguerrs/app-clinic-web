import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SedeRoutingModule } from './sede-routing.module';
import { SharedModule } from '../../theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { SedeDatosComponent } from './sede-datos/sede-datos.component';
import { SedeListadoComponent } from './sede-listado/sede-listado.component';
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
        SedeRoutingModule,
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
        SedeListadoComponent,
        SedeDatosComponent,
    ]
})
export class SedeModule { }
