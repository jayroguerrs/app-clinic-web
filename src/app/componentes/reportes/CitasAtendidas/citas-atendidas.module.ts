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
import {CitasAtendidasComponent} from "./citas-atendidas.component";
import {CitasAtendidasRoutingModule} from "./citas-atendidas-routing.module";
import {TblCronogramaCitasAtendidasModule} from "./TblCronogramaCitasAtendidas/tbl-cronograma-citas-atendidas.module";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        CitasAtendidasRoutingModule,
        StickyClassDirectiveModule,
        NgxSpinnerModule,
        FloatButtonModule,
        NgbTooltipModule,
        MatIconModule,
        MatTooltipModule,
        MatButtonModule,
        EspecialistaItemModule,
        AutocompleteSelectModule,
        TblCronogramaCitasAtendidasModule
    ],
    declarations: [CitasAtendidasComponent ],
    providers: [],
    exports: [CitasAtendidasComponent]
})
export class CitasAtendidasModule { }
