import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitaMensajeDetalleComponent } from './cita-mensaje-detalle.component';
import {FontawesomeSvgModule} from "../../fontawesome-svg/fontawesome-svg.module";
import {ReactiveFormsModule} from "@angular/forms";
import {MatRippleModule} from "@angular/material/core";
import {HistoryModule} from "../../loading/skeleton/history/history.module";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";



@NgModule({
  declarations: [CitaMensajeDetalleComponent],
  imports: [
    CommonModule,
    FontawesomeSvgModule,
    ReactiveFormsModule,
    MatRippleModule,
    HistoryModule,
    NgbTooltipModule
  ],
  exports: [CitaMensajeDetalleComponent],
  providers: [],
  bootstrap: [CitaMensajeDetalleComponent]
})
export class CitaMensajeDetalleModule { }
