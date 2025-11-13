import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {DataTablesModule} from "angular-datatables";
import {CitaDetalleComponent} from "./cita-detalle.component";


@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        DataTablesModule
    ],
    declarations: [CitaDetalleComponent ],
    providers: [DatePipe],
    exports: [CitaDetalleComponent]
})
export class CitaDetalleModule { }
