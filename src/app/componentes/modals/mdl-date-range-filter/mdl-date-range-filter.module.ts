import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontawesomeSvgModule } from '../../fontawesome-svg/fontawesome-svg.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MdlDateRangeFilterComponent} from "./mdl-date-range-filter.component";
import {FlatpickrModule} from "angularx-flatpickr";


@NgModule({
    declarations: [
        MdlDateRangeFilterComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FontawesomeSvgModule,
        FlatpickrModule
    ],
    exports: [MdlDateRangeFilterComponent],
    providers: [],
    bootstrap: [MdlDateRangeFilterComponent]
})
export class MdlDateRangeFilterModule { }