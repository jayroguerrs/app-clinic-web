import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar.component';
import {FontawesomeSvgModule} from "../../fontawesome-svg/fontawesome-svg.module";
import {SubmdlCronogramaCitaModule} from "../../modals/submodals/submdl-cronograma-cita/submdl-cronograma-cita.module";
import {MatRippleModule} from "@angular/material/core";
import {SubmdlMaquinaSedeModule} from "../../modals/submodals/submdl-maquina-sede/submdl-maquina-sede.module";

@NgModule({
  declarations: [CalendarComponent],
  imports: [
    CommonModule,
    FontawesomeSvgModule,
    SubmdlCronogramaCitaModule,
    MatRippleModule,
    SubmdlMaquinaSedeModule,
    FontawesomeSvgModule
  ],
  exports: [CalendarComponent],
  providers: [],
  bootstrap: [CalendarComponent]
})
export class CalendarModule { }
