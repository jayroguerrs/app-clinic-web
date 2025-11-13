import {NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {CommonModule, DatePipe, registerLocaleData} from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import localeEs from '@angular/common/locales/es-PE';
import {TblFacturaTipoIgvComponent} from "./tbl-factura-tipo-igv.component";

registerLocaleData(localeEs, 'es');

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        // SharedModule,
        DataTablesModule
    ],
    declarations: [
      TblFacturaTipoIgvComponent
    ],
    exports: [TblFacturaTipoIgvComponent],
    providers: [DatePipe],
    bootstrap: [TblFacturaTipoIgvComponent]
})
export class TblFacturaTipoIgvModule { }
