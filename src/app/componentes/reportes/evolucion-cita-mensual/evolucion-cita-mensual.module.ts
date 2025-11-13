import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { EvolucionCitaMensualRoutingModule } from './evolucion-cita-mensual-routing.module';
import { EvolucionCitaMensualComponent } from './evolucion-cita-mensual.component';
import { SharedModule } from '../../../theme/shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        EvolucionCitaMensualRoutingModule,
        SharedModule,
        DataTablesModule,
        NgbTooltipModule,
        NgxSpinnerModule
    ],
    declarations: [
        EvolucionCitaMensualComponent,
    ]
})
export class EvolucionCitaMensualModule { }