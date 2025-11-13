import {NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {CommonModule, DatePipe, registerLocaleData} from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import localeEs from '@angular/common/locales/es-PE';
import {SharedModule} from "../../../../theme/shared/shared.module";
import {HistoriaClinicaComponent} from "./historia-clinica.component";

registerLocaleData(localeEs, 'es');

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        DataTablesModule
    ],
    declarations: [
      HistoriaClinicaComponent
    ],
    exports: [HistoriaClinicaComponent],
    providers: [DatePipe],
    bootstrap: [HistoriaClinicaComponent]
})
export class HistoriaClinicaModule { }
