import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitaMensajeNotaComponent } from './cita-mensaje-nota.component';
import {FontawesomeSvgModule} from "../../fontawesome-svg/fontawesome-svg.module";
import {ReactiveFormsModule} from "@angular/forms";
import {MatRippleModule} from "@angular/material/core";
import {HistoryModule} from "../../loading/skeleton/history/history.module";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";



@NgModule({
  declarations: [CitaMensajeNotaComponent],
  imports: [
    CommonModule,
    FontawesomeSvgModule,
    ReactiveFormsModule,
    MatRippleModule,
    HistoryModule,
    NgbTooltipModule
  ],
  exports: [CitaMensajeNotaComponent],
  providers: [],
  bootstrap: [CitaMensajeNotaComponent]
})
export class CitaMensajeNotaModule { }
