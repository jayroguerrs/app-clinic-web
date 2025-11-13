import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {CommonModule, DatePipe} from '@angular/common';
import {AngularDualListBoxModule} from 'angular-dual-listbox';
import {TagInputModule} from 'ngx-chips';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import {AmazingTimePickerModule} from 'amazing-time-picker';
import {ColorPickerModule} from 'ngx-color-picker';
import {NgbDatepickerModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import { CitaCambiarHorarioComponent } from './cita-cambiar-horario.component';
import { CitaCambiarHorarioRoutingModule } from './cita-cambiar-horario-routing.module';
import { SharedModule } from '../../../theme/shared/shared.module';
import {MatDatepickerModule} from "@angular/material/datepicker";
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';



@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CitaCambiarHorarioRoutingModule,
        DataTablesModule,
        FormsModule,
        IonicModule,
        AngularDualListBoxModule,
        TagInputModule,
        SharedModule,
        AmazingTimePickerModule,
        ColorPickerModule,
        NgbDatepickerModule,
        NgbTooltipModule,

        MatDatepickerModule,
        MatNativeDateModule,
        // SwiperModule
    ],
    exports: [
        CitaCambiarHorarioComponent
    ],
    declarations: [
        CitaCambiarHorarioComponent
    ],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-ES' }, DatePipe]
})
export class CitaCambiarHorarioModule { }
