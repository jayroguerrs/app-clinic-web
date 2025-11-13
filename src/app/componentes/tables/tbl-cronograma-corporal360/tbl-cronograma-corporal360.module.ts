import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {NgxSpinnerModule} from "ngx-spinner";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {ReactiveFormsModule} from "@angular/forms";
import {TblCronogramaCorporal360Component} from "./tbl-cronograma-corporal360.component";
import {FontawesomeSvgModule} from "../../fontawesome-svg/fontawesome-svg.module";
import {MdlCronogramaCitaModule} from "../../modals/mdl-cronograma-cita/mdl-cronograma-cita.module";
import {SubmdlCronogramaCitaModule} from "../../modals/submodals/submdl-cronograma-cita/submdl-cronograma-cita.module";
import {FullCalendarModule} from "@fullcalendar/angular";
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction';
import {CalendarModule} from "../../widgets/calendar/calendar.module"; // a plugin!
//import bootstrapPlugin from '@fullcalendar/bootstrap';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  // bootstrapPlugin
]);

@NgModule({
  declarations: [TblCronogramaCorporal360Component],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    NgbTooltipModule,
    MatRippleModule,
    FontawesomeSvgModule,
    ReactiveFormsModule,
    MdlCronogramaCitaModule,
    SubmdlCronogramaCitaModule,
    FullCalendarModule
  ],
  exports: [TblCronogramaCorporal360Component],
  providers: [],
  bootstrap: [TblCronogramaCorporal360Component]
})
export class TblCronogramaCorporal360Module { }
