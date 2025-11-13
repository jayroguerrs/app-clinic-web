import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {CommonModule, DatePipe} from '@angular/common';
import {AngularDualListBoxModule} from 'angular-dual-listbox';
import {TagInputModule} from 'ngx-chips';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
//import { SignaturePadModule } from 'angular2-signaturepad';
import {AmazingTimePickerModule} from 'amazing-time-picker';
import {ColorPickerModule} from 'ngx-color-picker';
import {NgbDatepickerModule, NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import { CitaHorarioComponent } from './cita-horario.component';
import { CitaZonaCorporalComponent } from '../cita-zona-corporal/cita-zona-corporal.component';
import { CitaHorarioRoutingModule } from './cita-horario-routing.module';
import { SharedModule } from '../../../theme/shared/shared.module';
import {MatDatepickerModule} from "@angular/material/datepicker";
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import {CitaCambiarHorarioModule} from "../cita-cambiar-horario/cita-cambiar-horario.module";



@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CitaHorarioRoutingModule,
        DataTablesModule,
        FormsModule,
        IonicModule,
        //SignaturePadModule,
        AngularDualListBoxModule,
        TagInputModule,
        SharedModule,
        AmazingTimePickerModule,
        ColorPickerModule,
        NgbDatepickerModule,
        NgbTooltipModule,

        MatDatepickerModule,
        MatNativeDateModule,

        CitaCambiarHorarioModule,
        NgbDropdownModule
    ],
    exports: [
        CitaHorarioComponent
    ],
    declarations: [
        CitaHorarioComponent,
        CitaZonaCorporalComponent
    ],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-ES' }, DatePipe]
})
export class CitaHorarioModule { }
