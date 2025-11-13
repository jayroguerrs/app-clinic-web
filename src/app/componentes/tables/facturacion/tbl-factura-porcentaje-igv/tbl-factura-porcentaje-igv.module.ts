import {NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {CommonModule, DatePipe, registerLocaleData} from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import localeEs from '@angular/common/locales/es-PE';
import {TblFacturaPorcentajeIgvComponent} from "./tbl-factura-porcentaje-igv.component";

registerLocaleData(localeEs, 'es');

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        // SharedModule,
        DataTablesModule
    ],
    declarations: [
      TblFacturaPorcentajeIgvComponent
    ],
    exports: [TblFacturaPorcentajeIgvComponent],
    providers: [DatePipe],
    bootstrap: [TblFacturaPorcentajeIgvComponent]
})
export class TblFacturaPorcentajeIgvModule { }
