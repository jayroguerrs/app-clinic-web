import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from "../../../theme/shared/shared.module";
import {MdlAgendarCitaComponent} from "./mdl-agendar-cita.component";
import {MatRippleModule} from "@angular/material/core";
import {RouterModule} from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatRippleModule,
    RouterModule
  ],
    declarations: [
        MdlAgendarCitaComponent
    ],
    exports: [MdlAgendarCitaComponent],
    providers: [],
    bootstrap: [MdlAgendarCitaComponent]
})
export class MdlAgendarCitaModule { }
