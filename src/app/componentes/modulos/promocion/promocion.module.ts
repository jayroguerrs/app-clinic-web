import { NgModule } from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModuloPromocionRoutingModule } from './promocion-routing.module';
import { DataTablesModule } from 'angular-datatables';
import {NgbAccordionModule, NgbNavModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { PromocionVistaComponent } from './promocion-vista/promocion-vista.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {StickyClassDirectiveModule} from "../../../shared/directive/sticky-class.directive";
import {FontawesomeSvgModule} from "../../fontawesome-svg/fontawesome-svg.module";
import {MatRippleModule} from "@angular/material/core";
import {LoaderCircleModule} from "../../loading/loader/loader-circle/loader-circle.module";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ModuloPromocionRoutingModule,
        SharedModule,
        DataTablesModule,
        NgbTooltipModule,
        NgbNavModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        StickyClassDirectiveModule,
        NgbAccordionModule,
        FontawesomeSvgModule,
        MatRippleModule,
        LoaderCircleModule
    ],
    declarations: [
        PromocionVistaComponent,
    ]
})
export class ModuloPromocionModule { }
