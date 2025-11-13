import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from '../../../theme/shared/shared.module';
import { MenuListadoComponent } from './menu-listado.component';
import { MenuListadoRoutingModule } from './menu-listado-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MenuListadoRoutingModule,
        SharedModule,
        DataTablesModule, 
        FormsModule,
        NgbTooltipModule,
        NgxSpinnerModule
    ],
    declarations: [
        MenuListadoComponent
    ],
    exports: [
    ]
})
export class MenuListadoModule { }