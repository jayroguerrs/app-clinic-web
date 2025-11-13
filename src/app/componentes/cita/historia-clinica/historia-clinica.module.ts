import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { DataTablesModule } from "angular-datatables";
import { SharedModule } from "src/app/theme/shared/shared.module";
import { HistoriaClinicaRoutingModule } from './historia-clinica-routing.module';
import { HistoriaClinicaComponent } from './historia-clinica.component';
import { ClienteModule } from '../../cliente/cliente.module';
import { HistoriaClinicaDatosComponent } from '../historia-clinica-datos/historia-clinica-datos.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        HistoriaClinicaRoutingModule,
        SharedModule,
        DataTablesModule, 
        FormsModule,
        NgbTooltipModule,
        ClienteModule
    ],
    declarations: [
        HistoriaClinicaComponent,
        HistoriaClinicaDatosComponent
    ],
})
export class HistoriaClinicaModule { }