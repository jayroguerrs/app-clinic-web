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
import {AutocompleteSelectModule} from "../../../shared/components/autocomplete-select/autocomplete-select.module";
import {EspecialistaItemModule} from "../EspecialistaAtendidos/EspecialistaItem/especialista-item.module";
import {TblReporteCitasAdendidasDiariasModule} from "./TblReporteCitasAtendidasDiarias/tbl-reporte-citas-adendidas-diarias.module";
import {CitasAtendidasDiariasComponent} from "./citas-atendidas-diarias.component";
import {CitasAtendidasDiariasRoutingModule} from "./citas-atendidas-diarias-routing.module";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        StickyClassDirectiveModule,
        NgxSpinnerModule,
        FloatButtonModule,
        NgbTooltipModule,
        MatIconModule,
        MatTooltipModule,
        MatButtonModule,
        EspecialistaItemModule,
        AutocompleteSelectModule,
        TblReporteCitasAdendidasDiariasModule,
        CitasAtendidasDiariasRoutingModule
    ],
    declarations: [CitasAtendidasDiariasComponent ],
    providers: [],
    exports: [CitasAtendidasDiariasComponent]
})
export class CitasAtendidasDiariasModule { }
