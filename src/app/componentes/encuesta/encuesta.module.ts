import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EncuestaRoutingModule } from './encuesta-routing.module';
import { EncuestaComponent } from './encuesta.component';


@NgModule({
  declarations: [EncuestaComponent],
  imports: [
    CommonModule,
    EncuestaRoutingModule

  ]
})
export class EncuestaModule { }
