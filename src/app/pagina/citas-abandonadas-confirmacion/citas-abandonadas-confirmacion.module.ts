import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MatButtonModule} from "@angular/material/button";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {SharedModule} from "../../theme/shared/shared.module";
import {CitasAbandonadasConfirmacionRoutingModule} from "./citas-abandonadas-confirmacion-routing.module";
import {CitasAbandonadasConfirmacionComponent} from "./citas-abandonadas-confirmacion.component";

@NgModule({
    imports: [CommonModule,
        ReactiveFormsModule,
        CitasAbandonadasConfirmacionRoutingModule,
        SharedModule,
        DataTablesModule,
        FormsModule,
        NgbTooltipModule,
        NgxSpinnerModule,

        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatBottomSheetModule
    ],
    declarations: [
        CitasAbandonadasConfirmacionComponent,
    ]

})
export class CitasAbandonadasConfirmacionModule {}
