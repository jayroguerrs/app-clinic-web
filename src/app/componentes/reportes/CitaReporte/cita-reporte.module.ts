import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../theme/shared/shared.module';
import { IonicModule } from '@ionic/angular';
import {StickyClassDirectiveModule} from "../../../shared/directive/sticky-class.directive";
import {NgxSpinnerModule} from "ngx-spinner";
import {FloatButtonModule} from "../../../theme/shared/float/float.module";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonModule} from "@angular/material/button";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {EspecialistaItemModule} from "../EspecialistaAtendidos/EspecialistaItem/especialista-item.module";
import {TblCitaReporteModule} from "./tbl-cita-reporte/tbl-cita-reporte.module";
import {AutocompleteSelectModule} from "../../../shared/components/autocomplete-select/autocomplete-select.module";
import {CitaReporteRoutingModule} from "./cita-reporte-routing.module";
import {CitaReporteComponent} from "./cita-reporte.component";
import {FontawesomeSvgModule} from "../../fontawesome-svg/fontawesome-svg.module";
import {MatRippleModule} from "@angular/material/core";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        CitaReporteRoutingModule,
        StickyClassDirectiveModule,
        NgxSpinnerModule,
        FloatButtonModule,
        NgbTooltipModule,
        MatIconModule,
        MatTooltipModule,
        MatButtonModule,
        EspecialistaItemModule,
        AutocompleteSelectModule,
        TblCitaReporteModule,
        FontawesomeSvgModule,
        MatRippleModule,
    ],
    declarations: [CitaReporteComponent ],
    providers: [],
    exports: [CitaReporteComponent]
})
export class CitaReporteModule { }
