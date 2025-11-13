import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CitaConfirmacionComponent } from './cita-confirmacion.component';
import { CitaConfirmacionRoutingModule } from './cita-confirmacion-routing.module';
import { SharedModule } from '../../../theme/shared/shared.module';
import {MatButtonModule} from "@angular/material/button";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";

@NgModule({
    imports: [CommonModule,
        ReactiveFormsModule,
        CitaConfirmacionRoutingModule,
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
        CitaConfirmacionComponent,
    ]

})
export class CitaConfirmacionModule {}
