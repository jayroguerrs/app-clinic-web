import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventosRoutingModule } from './eventos-routing.module';
import { EventosComponent } from './eventos.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../theme/shared/shared.module";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {NgxSpinnerModule} from "ngx-spinner";
import { AutocompleteSelectModule } from '../../shared/components/autocomplete-select';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";

@NgModule({
  declarations: [EventosComponent],
  imports: [
    CommonModule,
    EventosRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    NgbTooltipModule,
    NgxSpinnerModule,
    AutocompleteSelectModule,
    // Material modules necesarios para el template actual
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule
  ],
  exports: [EventosComponent],
  providers: [],
  bootstrap: [EventosComponent]
})
export class EventosModule { }
