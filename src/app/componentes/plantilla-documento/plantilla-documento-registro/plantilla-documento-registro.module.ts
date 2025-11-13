import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {AutocompleteSelectModule} from "../../../shared/components/autocomplete-select/autocomplete-select.module";
import {NgxSpinnerModule} from "ngx-spinner";
import {PlantillaDocumentoRegistroComponent} from "./plantilla-documento-registro.component";
import {PlantillaDocumentoRegistroRoutingModule} from "./plantilla-documento-registro-routing.module";

import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";

@NgModule({
    declarations: [
        PlantillaDocumentoRegistroComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        DataTablesModule,
        FormsModule,
        IonicModule,
        PlantillaDocumentoRegistroRoutingModule,
        NgbTooltipModule,
        NgxSpinnerModule,
        AutocompleteSelectModule,
        //FroalaEditorModule,
        //FroalaViewModule,
        CKEditorModule,
        MatListModule,
        MatButtonModule,
        MatIconModule,
        MatBottomSheetModule
    ],
    exports: [ PlantillaDocumentoRegistroComponent ],
    providers: [],
    bootstrap: [ PlantillaDocumentoRegistroComponent ]

})
export class PlantillaDocumentoRegistroModule { }
