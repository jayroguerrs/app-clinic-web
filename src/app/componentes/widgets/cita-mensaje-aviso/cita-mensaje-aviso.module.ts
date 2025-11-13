import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitaMensajeAvisoComponent } from './cita-mensaje-aviso.component';
import {FontawesomeSvgModule} from "../../fontawesome-svg/fontawesome-svg.module";
import {ReactiveFormsModule} from "@angular/forms";
import {MatRippleModule} from "@angular/material/core";
import {HistoryModule} from "../../loading/skeleton/history/history.module";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";



@NgModule({
  declarations: [CitaMensajeAvisoComponent],
  imports: [
    CommonModule,
    FontawesomeSvgModule,
    ReactiveFormsModule,
    MatRippleModule,
    HistoryModule,
    NgbTooltipModule
  ],
  exports: [CitaMensajeAvisoComponent],
  providers: [],
  bootstrap: [CitaMensajeAvisoComponent]
})
export class CitaMensajeAvisoModule { }
