import {NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {CommonModule, DatePipe, registerLocaleData} from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import localeEs from '@angular/common/locales/es-PE';
import {TblFacturaMonedaComponent} from "./tbl-factura-moneda.component";

registerLocaleData(localeEs, 'es');

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        // SharedModule,
        DataTablesModule
    ],
    declarations: [
      TblFacturaMonedaComponent
    ],
    exports: [TblFacturaMonedaComponent],
    providers: [DatePipe],
    bootstrap: [TblFacturaMonedaComponent]
})
export class TblFacturaMonedaModule { }
