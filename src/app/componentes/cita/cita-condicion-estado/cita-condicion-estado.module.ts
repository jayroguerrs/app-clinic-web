import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../theme/shared/shared.module';
import { CitaCondicionEstadoComponent } from './cita-condicion-estado.component';
@NgModule({
    imports: [
        CommonModule,
        SharedModule,
    ],
    declarations: [
        CitaCondicionEstadoComponent,
    ],
    exports: [CitaCondicionEstadoComponent]
})
export class CitaCondicionEstadoModule { }