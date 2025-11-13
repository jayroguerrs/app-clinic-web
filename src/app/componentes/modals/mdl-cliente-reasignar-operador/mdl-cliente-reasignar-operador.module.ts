import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import {SharedModule} from "../../../theme/shared/shared.module";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {DataTablesModule} from "angular-datatables";
import {MdlClienteReasignarOperadorComponent} from "./mdl-cliente-reasignar-operador.component";

@NgModule({
    declarations: [
        MdlClienteReasignarOperadorComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        NgxSpinnerModule,
        NgbTooltipModule,
        DataTablesModule
    ],
    exports: [MdlClienteReasignarOperadorComponent],
    providers: [],
    bootstrap: [MdlClienteReasignarOperadorComponent]
})
export class MdlClienteReasignarOperadorModule { }
