import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {DataTablesModule} from "angular-datatables";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import { TblCitaReporteComponent } from './tbl-cita-reporte.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        DataTablesModule,
        MatProgressBarModule
    ],
    declarations: [TblCitaReporteComponent ],
    providers: [],
    exports: [TblCitaReporteComponent]
})
export class TblCitaReporteModule { }
