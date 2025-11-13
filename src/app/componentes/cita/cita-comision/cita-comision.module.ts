import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../theme/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';

import { CitaComisionComponent } from './cita-comision.component';
import { CitaComisionRoutingModule } from './cita-comision-routing.module';
import { CitaComisionDetalleComponent } from '../cita-comision-detalle/cita-comision-detalle.component';
import {StickyClassDirectiveModule} from "../../../shared/directive/sticky-class.directive";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CitaComisionRoutingModule,
        SharedModule,
        DataTablesModule,
        FormsModule,
        NgbTooltipModule,
        StickyClassDirectiveModule,
        MatProgressSpinnerModule,
        MatBottomSheetModule,
        MatIconModule,
        MatListModule,
        MatButtonModule
    ],
    declarations: [
        CitaComisionComponent,
        CitaComisionDetalleComponent
    ]
})
export class CitaComisionModule {}
