import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReporteCitasComponent } from './reportecitas.component';

import { ReportecitasRoutingModule } from './/reportecitas-routing.module';
import {ChartModule} from 'angular2-chartjs';
import {MorrisJsModule} from 'angular-morris-js';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        DataTablesModule, 
        FormsModule,
        IonicModule,
        ReportecitasRoutingModule,
        ChartModule,
        NgbTooltipModule,
        MorrisJsModule
    ],
    declarations: [ReporteCitasComponent ]
})
export class ReporteCitaModule { }