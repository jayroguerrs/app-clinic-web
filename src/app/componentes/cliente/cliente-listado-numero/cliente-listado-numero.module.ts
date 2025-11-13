import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ClienteListadoNumeroRoutingModule } from './cliente-listado-numero-routing.module';
import { ClienteListadoNumeroComponent } from './cliente-listado-numero.component'
import { SharedModule } from 'src/app/theme/shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ClienteListadoNumeroRoutingModule,
        DataTablesModule, 
        FormsModule,
        NgbTooltipModule,
        NgxSpinnerModule,
        SharedModule
    ],
    declarations: [
        ClienteListadoNumeroComponent
    ]
})
export class ClienteListadoNumeroModule { }