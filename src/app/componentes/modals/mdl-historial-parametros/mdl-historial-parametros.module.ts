import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdlHistorialParametrosComponent } from './mdl-historial-parametros.component';
import { MdlFotosParametrosCitaListadoModule } from '../mdl-fotos-parametros-cita-listado/mdl-fotos-parametros-cita-listado.module';



@NgModule({
  declarations: [
    MdlHistorialParametrosComponent
  ],
  imports: [
    CommonModule,
    MdlFotosParametrosCitaListadoModule
  ]
})
export class MdlHistorialParametrosModule { }
