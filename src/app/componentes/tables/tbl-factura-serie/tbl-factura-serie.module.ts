import {NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {CommonModule, DatePipe, registerLocaleData} from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import localeEs from '@angular/common/locales/es-PE';
import {TblFacturaSerieComponent} from "./tbl-factura-serie.component";

registerLocaleData(localeEs, 'es');

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        // SharedModule,
        DataTablesModule
    ],
    declarations: [
      TblFacturaSerieComponent
    ],
    exports: [TblFacturaSerieComponent],
    providers: [DatePipe],
    bootstrap: [TblFacturaSerieComponent]
})
export class TblFacturaSerieModule { }
