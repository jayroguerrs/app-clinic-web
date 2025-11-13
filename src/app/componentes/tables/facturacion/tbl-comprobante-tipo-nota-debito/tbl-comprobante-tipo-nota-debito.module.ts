import {NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {CommonModule, DatePipe, registerLocaleData} from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import localeEs from '@angular/common/locales/es-PE';
import {TblComprobanteTipoNotaDebitoComponent} from "./tbl-comprobante-tipo-nota-debito.component";

registerLocaleData(localeEs, 'es');

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        // SharedModule,
        DataTablesModule
    ],
    declarations: [
      TblComprobanteTipoNotaDebitoComponent
    ],
    exports: [TblComprobanteTipoNotaDebitoComponent],
    providers: [DatePipe],
    bootstrap: [TblComprobanteTipoNotaDebitoComponent]
})
export class TblComprobanteTipoNotaDebitoModule { }
