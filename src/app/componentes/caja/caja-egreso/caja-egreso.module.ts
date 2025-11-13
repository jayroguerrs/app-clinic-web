import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../../theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CajaEgresoComponent } from './caja-egreso.component';
import { CajaEgresoRoutingModule } from './caja-egreso-routing.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CajaEgresoDatosComponent } from '../caja-egreso-datos/caja-egreso-datos.component';
import { NgxCurrencyModule } from 'ngx-currency';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        DataTablesModule,
        FormsModule,
        NgxSpinnerModule,
        CajaEgresoRoutingModule,
        NgbTooltipModule,
        NgxCurrencyModule
    ],
    declarations: [
        CajaEgresoComponent,
        CajaEgresoDatosComponent
    ]
})
export class CajaEgresoModule {}