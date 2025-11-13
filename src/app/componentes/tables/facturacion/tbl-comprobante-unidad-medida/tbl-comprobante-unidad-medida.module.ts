import {NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {CommonModule, DatePipe, registerLocaleData} from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import localeEs from '@angular/common/locales/es-PE';
import {TblComprobanteUnidadMedidaComponent} from "./tbl-comprobante-unidad-medida.component";

registerLocaleData(localeEs, 'es');

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        // SharedModule,
        DataTablesModule
    ],
    declarations: [
      TblComprobanteUnidadMedidaComponent
    ],
    exports: [TblComprobanteUnidadMedidaComponent],
    providers: [DatePipe],
    bootstrap: [TblComprobanteUnidadMedidaComponent]
})
export class TblComprobanteUnidadMedidaModule { }
