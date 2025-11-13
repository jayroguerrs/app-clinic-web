import {NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {CommonModule, DatePipe, registerLocaleData} from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import localeEs from '@angular/common/locales/es-PE';
import {TblComprobanteTipoNotaCreditoComponent} from "./tbl-comprobante-tipo-nota-credito.component";

registerLocaleData(localeEs, 'es');

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        // SharedModule,
        DataTablesModule
    ],
    declarations: [
      TblComprobanteTipoNotaCreditoComponent
    ],
    exports: [TblComprobanteTipoNotaCreditoComponent],
    providers: [DatePipe],
    bootstrap: [TblComprobanteTipoNotaCreditoComponent]
})
export class TblComprobanteTipoNotaCreditoModule { }
