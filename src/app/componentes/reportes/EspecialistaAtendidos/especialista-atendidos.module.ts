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
import {EspecialistaAtendidosRoutingModule} from "./especialista-atendidos-routing.module";
import {EspecialistaAtendidosComponent} from "./especialista-atendidos.component";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {EspecialistaItemModule} from "./EspecialistaItem/especialista-item.module";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        EspecialistaAtendidosRoutingModule,
        StickyClassDirectiveModule,
        NgxSpinnerModule,
        FloatButtonModule,
        NgbTooltipModule,
        MatIconModule,
        MatTooltipModule,
        MatButtonModule,
        EspecialistaItemModule
    ],
    declarations: [EspecialistaAtendidosComponent ],
    providers: [],
    exports: [EspecialistaAtendidosComponent]
})
export class EspecialistaAtendidosModule { }
