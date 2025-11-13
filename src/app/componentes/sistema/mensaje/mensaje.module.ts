import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MensajeComponent } from './mensaje.component';
import { SharedModule } from '../../../theme/shared/shared.module';
import { MensajeRoutingModule } from './mensaje-routing.module';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MensajeRoutingModule,
        SharedModule,
        NgbTooltipModule,
        NgxSpinnerModule
    ],
    declarations: [
        MensajeComponent
    ]
})
export class MensajeModule { }