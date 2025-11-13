import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EspecialistasComponent } from './especialistas.component';

import { EspecialistasRoutingModule } from './especialistas-routing.module';
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
        EspecialistasRoutingModule,
        ChartModule,
        NgbTooltipModule,
        MorrisJsModule
    ],
    declarations: [EspecialistasComponent ]
})
export class EspecialistasModule { }