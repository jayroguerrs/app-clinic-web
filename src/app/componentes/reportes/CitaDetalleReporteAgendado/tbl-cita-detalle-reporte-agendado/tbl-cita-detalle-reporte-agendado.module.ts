import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {DataTablesModule} from "angular-datatables";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {TblCitaDetalleReporteAgendadoComponent} from "./tbl-cita-detalle-reporte-agendado.component";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        DataTablesModule,
        MatProgressBarModule
    ],
    declarations: [TblCitaDetalleReporteAgendadoComponent ],
    providers: [],
    exports: [TblCitaDetalleReporteAgendadoComponent]
})
export class TblCitaDetalleReporteAgendadoModule { }
