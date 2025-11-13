import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ZonaCorporalSeleccionarRoutingModule } from './zona-corporal-seleccionar-routing.module';
import { ZonaCorporalSeleccionarComponent } from './zona-corporal-seleccionar.component';
import { SharedModule } from '../../../theme/shared/shared.module';
import { FilterTextPipe } from '../../../shared/pipe/filter-text.pipe';
import { AutocompleteSelectModule } from '../../../shared/components/autocomplete-select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        NgbTooltipModule,
        NgxSpinnerModule,
        ZonaCorporalSeleccionarRoutingModule,
        AutocompleteSelectModule,

        FormsModule,
        MatAutocompleteModule,
        MatOptionModule,
        MatInputModule,
        MatIconModule
    ],
    declarations: [
        ZonaCorporalSeleccionarComponent,
        FilterTextPipe
    ],
    exports: [
        ZonaCorporalSeleccionarComponent
    ]
})
export class ZonaCorporalSeleccionarModule { }