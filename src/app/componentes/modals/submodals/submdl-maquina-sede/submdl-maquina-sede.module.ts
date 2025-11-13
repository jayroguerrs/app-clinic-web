import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {MatRippleModule} from '@angular/material/core';
import {FontawesomeSvgModule} from "../../../fontawesome-svg/fontawesome-svg.module";
import {SubmdlMaquinaSedeComponent} from "./submdl-maquina-sede.component";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {SubmdlCronogramaCitaModule} from "../submdl-cronograma-cita/submdl-cronograma-cita.module";


@NgModule({
  declarations: [
    SubmdlMaquinaSedeComponent
  ],
  imports: [
    CommonModule,
    MatRippleModule,
    NgbTooltipModule,
    FontawesomeSvgModule,
    SubmdlCronogramaCitaModule
  ],
  exports: [SubmdlMaquinaSedeComponent],
  providers: [DatePipe],
  bootstrap: [SubmdlMaquinaSedeComponent]
})
export class SubmdlMaquinaSedeModule { }
