import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnauthorizedRoutingModule } from './unauthorized-routing.module';
import { AccessComponent } from './access/access.component';
import { ActualizarDatosComponent } from './actualizar-datos/actualizar-datos.component';
import { MdlActualizarDatosUserModule } from '../modals/mdl-actualizar-datos-user/mdl-actualizar-datos-user.module';
import { QaAccessComponent } from './qa-access/qa-access.component';


@NgModule({
  declarations: [AccessComponent, ActualizarDatosComponent, QaAccessComponent],
  imports: [
    CommonModule,
    UnauthorizedRoutingModule,
    MdlActualizarDatosUserModule
  ],
  exports: [
    AccessComponent
  ]
})
export class UnauthorizedModule { }
