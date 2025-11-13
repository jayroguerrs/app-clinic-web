import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import {ChartModule} from 'angular2-chartjs';
import {MorrisJsModule} from 'angular-morris-js';

import {StickyClassDirectiveModule} from "../../../shared/directive/sticky-class.directive";
import {NgxSpinnerModule} from "ngx-spinner";
import {FloatButtonModule} from "../../../theme/shared/float/float.module";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonModule} from "@angular/material/button";
import {ReportecitaencuestaRoutingModule} from "./reportecitaencuesta-routing.module";
import {ReportecitaencuestaComponent} from "./reportecitaencuesta.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        DataTablesModule,
        FormsModule,
        IonicModule,
        ReportecitaencuestaRoutingModule,
        ChartModule,
        NgbTooltipModule,
        MorrisJsModule,
        StickyClassDirectiveModule,
        NgxSpinnerModule,
        FloatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatButtonModule
    ],
    declarations: [ReportecitaencuestaComponent ]
})
export class ReporteCitaEncuestaModule { }
