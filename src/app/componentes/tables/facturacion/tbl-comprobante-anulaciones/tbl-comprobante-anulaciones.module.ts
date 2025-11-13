import {NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {CommonModule, DatePipe, registerLocaleData} from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import localeEs from '@angular/common/locales/es-PE';
import {TblComprobanteAnulacionesComponent} from "./tbl-comprobante-anulaciones.component";
import {MdlPdfGoogleViewModule} from "../../../modals/mdl-pdf-google-view/mdl-pdf-google-view.module";

registerLocaleData(localeEs, 'es');

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        // SharedModule,
        DataTablesModule,
        MdlPdfGoogleViewModule
    ],
    declarations: [
      TblComprobanteAnulacionesComponent
    ],
    exports: [TblComprobanteAnulacionesComponent],
    providers: [DatePipe],
    bootstrap: [TblComprobanteAnulacionesComponent]
})
export class TblComprobanteAnulacionesModule { }
