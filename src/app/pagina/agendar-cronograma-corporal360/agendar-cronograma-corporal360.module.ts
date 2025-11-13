import {LOCALE_ID, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import {NgxSpinnerModule} from "ngx-spinner";
import {SharedModule} from "../../theme/shared/shared.module";
import {NgbDropdownModule, NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {FontawesomeSvgModule} from "../../componentes/fontawesome-svg/fontawesome-svg.module";
import {ReactiveFormsModule} from "@angular/forms";
import {AgendarCronogramaCorporal360Component} from "./agendar-cronograma-corporal360.component";
import {AgendarCronogramaCorporal360RoutingModule} from "./agendar-cronograma-corporal360-routing.module";
import {
  TblCronogramaCorporal360Module
} from "../../componentes/tables/tbl-cronograma-corporal360/tbl-cronograma-corporal360.module";
import {DisableControlModule} from "../../shared/directive/disable-control/disable-control.module";
import {CalendarModule} from "../../componentes/widgets/calendar/calendar.module";
import {NgxCurrencyModule} from "ngx-currency";
import {MdlCronogramaHistorialModule} from "../../corporal360/componente/modal/mdl-cronograma-historial/mdl-cronograma-historial.module";
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [AgendarCronogramaCorporal360Component],
  imports: [
    CommonModule,
    AgendarCronogramaCorporal360RoutingModule,
    NgxSpinnerModule,
    SharedModule,
    NgbTooltipModule,
    MatRippleModule,
    FontawesomeSvgModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    DisableControlModule,
    CalendarModule,
    NgxCurrencyModule,
    MdlCronogramaHistorialModule,
    MatButtonModule
  ],
  exports: [AgendarCronogramaCorporal360Component],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }],
  bootstrap: [AgendarCronogramaCorporal360Component]
})
export class AgendarCronogramaCorporal360Module { }
