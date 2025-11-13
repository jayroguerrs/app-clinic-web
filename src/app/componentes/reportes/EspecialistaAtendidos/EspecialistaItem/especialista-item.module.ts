import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {CommonModule, DatePipe} from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {SharedModule} from "../../../../theme/shared/shared.module";
import {EspecialistaItemComponent} from "./especialista-item.component";
import {DataTablesModule} from "angular-datatables";
import {CitaDetalleModule} from "../CitaDetalle/cita-detalle.module";


@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        DataTablesModule,
        CitaDetalleModule
    ],
    declarations: [EspecialistaItemComponent ],
    providers: [DatePipe],
    exports: [EspecialistaItemComponent]
})
export class EspecialistaItemModule { }
