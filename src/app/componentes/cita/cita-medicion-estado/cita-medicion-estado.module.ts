import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../theme/shared/shared.module';
import {CitaMedicionEstadoComponent} from "./cita-medicion-estado.component";
@NgModule({
    imports: [
        CommonModule,
        SharedModule,
    ],
    declarations: [
        CitaMedicionEstadoComponent,
    ],
    exports: [CitaMedicionEstadoComponent]
})
export class CitaMedicionEstadoModule { }
