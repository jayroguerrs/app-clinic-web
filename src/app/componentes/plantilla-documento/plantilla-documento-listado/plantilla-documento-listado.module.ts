import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {AutocompleteSelectModule} from "../../../shared/components/autocomplete-select/autocomplete-select.module";
import {PlantillaDocumentoListadoComponent} from "./plantilla-documento-listado.component";
import {PlantillaDocumentoListadoRoutingModule} from "./plantilla-documento-listado-routing.module";
import {NgxSpinnerModule} from "ngx-spinner";
import {MatListModule} from "@angular/material/list";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@NgModule({
    declarations: [
        PlantillaDocumentoListadoComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        DataTablesModule,
        FormsModule,
        IonicModule,
        PlantillaDocumentoListadoRoutingModule,
        NgbTooltipModule,
        NgxSpinnerModule,
        AutocompleteSelectModule,

        MatListModule,
        MatBottomSheetModule,
        DragDropModule,
        MatButtonModule,
        MatIconModule
    ],
    exports: [ PlantillaDocumentoListadoComponent ],
    providers: [],
    bootstrap: [ PlantillaDocumentoListadoComponent ]

})
export class PlantillaDocumentoListadoModule { }
