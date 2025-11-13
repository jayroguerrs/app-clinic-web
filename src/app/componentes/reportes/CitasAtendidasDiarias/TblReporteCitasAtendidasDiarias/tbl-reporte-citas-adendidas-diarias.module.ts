import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {DataTablesModule} from "angular-datatables";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {TblReporteCitasAdendidasDiariasComponent} from "./tbl-reporte-citas-adendidas-diarias.component";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        DataTablesModule,
        MatProgressBarModule
    ],
    declarations: [TblReporteCitasAdendidasDiariasComponent ],
    providers: [],
    exports: [TblReporteCitasAdendidasDiariasComponent]
})
export class TblReporteCitasAdendidasDiariasModule { }
