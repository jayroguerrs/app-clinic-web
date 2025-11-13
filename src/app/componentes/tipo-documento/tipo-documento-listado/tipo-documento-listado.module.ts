import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {TipoDocumentoListadoComponent} from "./tipo-documento-listado.component";
import {TipoDocumentoListadoRoutingModule} from "./tipo-documento-listado-routing.module";
import {NgxSpinnerModule} from "ngx-spinner";
import {TipoDocumentoDatosComponent} from "../tipo-documento-datos/tipo-documento-datos.component";
import {TipoDocumentoPerfilesComponent} from "../tipo-documento-perfiles/tipo-documento-perfiles.component";
import { AutocompleteSelectModule } from '../../../shared/components/autocomplete-select';
import {MatListModule} from "@angular/material/list";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@NgModule({
    declarations: [
        TipoDocumentoListadoComponent,
        TipoDocumentoPerfilesComponent,
        TipoDocumentoDatosComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        DataTablesModule,
        FormsModule,
        IonicModule,
        TipoDocumentoListadoRoutingModule,
        NgbTooltipModule,
        NgxSpinnerModule,
        AutocompleteSelectModule,

        MatListModule,
        MatBottomSheetModule,
        DragDropModule,
        MatButtonModule,
        MatIconModule
    ],
    exports: [ TipoDocumentoListadoComponent ],
    providers: [],
    bootstrap: [ TipoDocumentoListadoComponent ]

})
export class TipoDocumentoListadoModule { }
