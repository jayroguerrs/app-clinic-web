import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { CajaRoutingModule} from './caja-routing.module';
import { CajaListadoComponent } from './caja-listado/caja-listado.component';
import { CajaDatosComponent } from './caja-datos/caja-datos.component';

import {NgbModalModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CajaAperturaComponent } from './caja-apertura/caja-apertura.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { NgxSpinnerModule } from 'ngx-spinner';
import { UsuarioSeleccionModule } from '../usuario/usuario-seleccion/usuario-seleccion.module';
import { CajaCuadreComponent } from './caja-cuadre/caja-cuadre.component';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {MatListModule} from "@angular/material/list";
import {CajaCierreComponent} from "./caja-cierre/caja-cierre.component";
import {MdlPdfGoogleViewModule} from "../modals/mdl-pdf-google-view/mdl-pdf-google-view.module";
import { CajaPosComponent } from './caja-pos/caja-pos.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        DataTablesModule,
        FormsModule,
        CajaRoutingModule,
        NgbTooltipModule,
        NgxCurrencyModule,
        NgxSpinnerModule,
        UsuarioSeleccionModule,

        MatIconModule,
        MatButtonModule,
        MatBottomSheetModule,
        MatListModule,

        MdlPdfGoogleViewModule,
        NgbModalModule
    ],
    declarations: [
        CajaDatosComponent,
        CajaListadoComponent,
        CajaAperturaComponent,
        CajaCierreComponent,
        CajaCuadreComponent,
        CajaPosComponent,
    ]
})
export class CajaModule { }
