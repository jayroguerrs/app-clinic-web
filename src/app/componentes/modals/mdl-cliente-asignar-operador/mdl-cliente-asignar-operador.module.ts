import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import {SharedModule} from "../../../theme/shared/shared.module";
import {MdlClienteAsignarOperadorComponent} from "./mdl-cliente-asignar-operador.component";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {DataTablesModule} from "angular-datatables";

@NgModule({
    declarations: [
        MdlClienteAsignarOperadorComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        NgxSpinnerModule,
        NgbTooltipModule,
        DataTablesModule
    ],
    exports: [MdlClienteAsignarOperadorComponent],
    providers: [],
    bootstrap: [MdlClienteAsignarOperadorComponent]
})
export class MdlClienteAsignarOperadorModule { }
