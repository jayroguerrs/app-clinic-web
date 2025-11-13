import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdlFotosParametrosCitaComponent } from './mdl-fotos-parametros-cita.component';
import {WebcamModule} from 'ngx-webcam';

@NgModule({
  declarations: [
    MdlFotosParametrosCitaComponent
  ],
  imports: [
    CommonModule,
    WebcamModule 
  ]
})
export class MdlFotosParametrosCitaModule { }
