import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {TblCronogramaCitasAtendidasComponent} from "./tbl-cronograma-citas-atendidas.component";
import {TblCronogramaCitasAtendidasRoutingModule} from "./tbl-cronograma-citas-atendidas-routing.module";
import {DataTablesModule} from "angular-datatables";
import {MatProgressBarModule} from "@angular/material/progress-bar";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        DataTablesModule,
        TblCronogramaCitasAtendidasRoutingModule,
        MatProgressBarModule
    ],
    declarations: [TblCronogramaCitasAtendidasComponent ],
    providers: [],
    exports: [TblCronogramaCitasAtendidasComponent]
})
export class TblCronogramaCitasAtendidasModule { }
