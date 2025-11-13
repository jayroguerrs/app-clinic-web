import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {DataTablesModule} from "angular-datatables";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {TblCitaReporteDetalladoComponent} from "./tbl-cita-reporte-detallado.component";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        DataTablesModule,
        MatProgressBarModule
    ],
    declarations: [TblCitaReporteDetalladoComponent ],
    providers: [],
    exports: [TblCitaReporteDetalladoComponent]
})
export class TblCitaReporteDetalladoModule { }
