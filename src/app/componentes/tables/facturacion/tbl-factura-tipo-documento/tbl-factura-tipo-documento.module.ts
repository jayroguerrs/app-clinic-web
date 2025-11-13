import {NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {CommonModule, DatePipe, registerLocaleData} from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import localeEs from '@angular/common/locales/es-PE';
import {TblFacturaTipoDocumentoComponent} from "./tbl-factura-tipo-documento.component";

registerLocaleData(localeEs, 'es');

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        // SharedModule,
        DataTablesModule
    ],
    declarations: [
      TblFacturaTipoDocumentoComponent
    ],
    exports: [TblFacturaTipoDocumentoComponent],
    providers: [DatePipe],
    bootstrap: [TblFacturaTipoDocumentoComponent]
})
export class TblFacturaTipoDocumentoModule { }
