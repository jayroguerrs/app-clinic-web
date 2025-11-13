import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReporteZonasMenosComponent } from './reportezonasmenos.component';
import { ReporteZonasMinimoRoutingModule } from './reportezonasminimo-routing.module';
import {ChartModule} from 'angular2-chartjs';
import {MorrisJsModule} from 'angular-morris-js';
import {Ng2GoogleChartsModule} from 'ng2-google-charts';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        DataTablesModule, 
        FormsModule,
        IonicModule,
        ReporteZonasMinimoRoutingModule,
        ChartModule,
        NgbTooltipModule,
        Ng2GoogleChartsModule,
        MorrisJsModule
    ],
    declarations: [ReporteZonasMenosComponent ]
})
export class ZonaMinimoReportesModule { }