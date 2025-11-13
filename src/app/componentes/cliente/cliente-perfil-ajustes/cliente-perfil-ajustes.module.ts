import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientePerfilAjustesRoutingModule } from './cliente-perfil-ajustes-routing.module';
import { ClientePerfilAjustesComponent } from './cliente-perfil-ajustes.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatRippleModule} from "@angular/material/core";
import {NgxSpinnerModule} from "ngx-spinner";
import {MdlUbicacionModule} from "../../modals/mdl-ubicacion/mdl-ubicacion.module";


@NgModule({
  declarations: [ClientePerfilAjustesComponent],
  imports: [
    CommonModule,
    ClientePerfilAjustesRoutingModule,
    ReactiveFormsModule,
    MatRippleModule,
    NgxSpinnerModule,

    MdlUbicacionModule
  ],
  exports: [ClientePerfilAjustesComponent],
  providers: [],
  bootstrap: [ClientePerfilAjustesComponent]
})
export class ClientePerfilAjustesModule { }
