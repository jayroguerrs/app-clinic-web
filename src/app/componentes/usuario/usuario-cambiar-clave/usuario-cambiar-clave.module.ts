import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { UsuarioCambiarClaveRoutingModule } from './usuario-cambiar-clave-routing.module';
import { SharedModule } from '../../../theme/shared/shared.module'
import { UsuarioCambiarClaveComponent } from './usuario-cambiar-clave.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        UsuarioCambiarClaveRoutingModule,
        SharedModule,
        DataTablesModule,
        NgbTooltipModule,
        FormsModule,
        NgxSpinnerModule
    ],
    declarations: [
        UsuarioCambiarClaveComponent
    ]
})
export class UsuarioCambiarClaveModule { }