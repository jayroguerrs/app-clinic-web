import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables'
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { IncidenciaRoutingModule } from './incidencia-routing.module';
import { IncidenciaListadoComponent} from './incidencia-listado/incidencia-listado.component';
import { IncidenciaDatosComponent } from './incidencia-datos/incidencia-datos.component';
import { SharedModule } from '../../../theme/shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        IncidenciaRoutingModule,
        SharedModule,
        DataTablesModule,
        NgbTooltipModule,
        NgxSpinnerModule
    ],
    declarations: [
        IncidenciaListadoComponent,
        IncidenciaDatosComponent
    ]
})
export class IncidenciaModule { }