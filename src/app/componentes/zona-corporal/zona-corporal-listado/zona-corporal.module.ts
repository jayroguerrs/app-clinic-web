import { NgModule,Renderer2 } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables'
import { ZonaCorporalRoutingModule } from './zona-corporal-routing.module';
import { ZonaCorporalListadoComponent } from '../zona-corporal-listado/zona-corporal-listado.component';
import { ZonaCorporalDatosComponent } from '../zona-corporal-datos/zona-corporal-datos.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ZonaCorporalHijoComponent } from '../zona-corporal-hijo/zona-corporal-hijo.component';
import { TagInputModule } from 'ngx-chips';
import { NgxSpinnerModule } from 'ngx-spinner';
import {NumbersOnly} from "../../../shared/directive/number-only.directive";

import {ZonaCorporalSubZonasComponent} from "../zona-corporal-sub-zonas/zona-corporal-sub-zonas.component";
import {MatListModule} from "@angular/material/list";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatInputModule} from "@angular/material/input";
import {MatChipsModule} from "@angular/material/chips";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MdlZonaSesionTratamientoModule} from "../../modals/mdl-zona-sesion-tratamiento/mdl-zona-sesion-tratamiento.module";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ZonaCorporalRoutingModule,
        SharedModule,
        DataTablesModule,
        NgbTooltipModule,
        TagInputModule,
        NgxSpinnerModule,

        MatListModule,
        MatBottomSheetModule,
        DragDropModule,
        MatButtonModule,
        MatIconModule,
        MatAutocompleteModule,
        MatInputModule,
        MatChipsModule,
        MatFormFieldModule,

        MdlZonaSesionTratamientoModule
    ],
    declarations: [
        ZonaCorporalListadoComponent,
        ZonaCorporalDatosComponent,
        ZonaCorporalHijoComponent,
        ZonaCorporalSubZonasComponent
    ],
  providers:[]
})
export class ZonaCorporalModule { }
