import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../theme/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';

import { ClienteRoutingModule } from './cliente-routing.module';
import { ClienteListadoComponent } from './cliente-listado/cliente-listado.component';
import { ClienteDatosComponent } from './cliente-datos/cliente-datos.component';
import { ClienteFirmaComponent } from './cliente-firma/cliente-firma.component';
import { ClienteListadoModalComponent } from './cliente-listado-modal/cliente-listado-modal.component';
import { PreferenteModule } from '../preferente/preferente.module';
import { CellMaskDirectiveModule } from '../../shared/directive/cell-mask.directive';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DniMaskDirectiveModule } from '../../shared/directive/dni-mask.directive';
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {MatButtonModule} from "@angular/material/button";
import {MdlAgendarCitaModule} from "../modals/mdl-agendar-cita/mdl-agendar-cita.module";


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ClienteRoutingModule,
        SharedModule,
        DataTablesModule,
        FormsModule,
        NgbTooltipModule,
        PreferenteModule,
        CellMaskDirectiveModule,
        DniMaskDirectiveModule,
        NgxSpinnerModule,

        MatListModule,
        MatIconModule,
        MatButtonModule,
        MatBottomSheetModule,
        MdlAgendarCitaModule,
    ],
    declarations: [
        ClienteListadoComponent,
        ClienteDatosComponent,
        ClienteFirmaComponent,
        ClienteListadoModalComponent,
    ],
    exports: [
        ClienteListadoModalComponent,
    ]
})
export class ClienteModule { }
