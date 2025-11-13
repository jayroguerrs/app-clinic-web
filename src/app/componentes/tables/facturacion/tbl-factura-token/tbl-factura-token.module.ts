import {NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {CommonModule, DatePipe, registerLocaleData} from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import localeEs from '@angular/common/locales/es-PE';
import {TblFacturaTokenComponent} from "./tbl-factura-token.component";

registerLocaleData(localeEs, 'es');

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        // SharedModule,
        DataTablesModule
    ],
    declarations: [
      TblFacturaTokenComponent
    ],
    exports: [TblFacturaTokenComponent],
    providers: [DatePipe],
    bootstrap: [TblFacturaTokenComponent]
})
export class TblFacturaTokenModule { }
