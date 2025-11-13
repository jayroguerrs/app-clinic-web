import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {CommonModule, DatePipe} from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from '../../../../theme/shared/shared.module';
import { DocumentoListadoComponent } from './documento-listado.component';
import { DocumentoListadoRoutingModule } from './documento-listado-routing.module';
import { ClienteModule } from '../../../cliente/cliente.module';
import { ZonaCorporalSeleccionarModule} from '../../../zona-corporal/zona-corporal-seleccionar/zona-corporal-seleccionar.module';
import {DragDropModule} from "@angular/cdk/drag-drop";
import {DocumentoAnulacionModule} from "../documento-anulacion/documento-anulacion.module";
import {DocumentoDatosModule} from "../documento-datos/documento-datos.module";
import {MatListModule} from "@angular/material/list";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DocumentoListadoRoutingModule,
        SharedModule,
        DataTablesModule,
        NgbTooltipModule,
        FormsModule,
        NgxSpinnerModule,
        ClienteModule,
        ZonaCorporalSeleccionarModule,
        DragDropModule,
        DocumentoAnulacionModule,
        DocumentoDatosModule,

        MatListModule,
        MatBottomSheetModule,
        DragDropModule,
        MatButtonModule,
        MatIconModule
    ],
    declarations: [
        DocumentoListadoComponent
    ],
    providers: [DatePipe]
})
export class DocumentoListadoModule { }
