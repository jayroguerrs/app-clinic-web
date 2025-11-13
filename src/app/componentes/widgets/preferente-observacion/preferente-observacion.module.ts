import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FontawesomeSvgModule} from "../../fontawesome-svg/fontawesome-svg.module";
import {ReactiveFormsModule} from "@angular/forms";
import {MatRippleModule} from "@angular/material/core";
import {HistoryModule} from "../../loading/skeleton/history/history.module";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {PreferenteObservacionComponent} from "./preferente-observacion.component";



@NgModule({
  declarations: [PreferenteObservacionComponent],
  imports: [
    CommonModule,
    FontawesomeSvgModule,
    ReactiveFormsModule,
    MatRippleModule,
    HistoryModule,
    NgbTooltipModule
  ],
  exports: [PreferenteObservacionComponent],
  providers: [],
  bootstrap: [PreferenteObservacionComponent]
})
export class PreferenteObservacionModule { }
