import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientePerfilAclaramientoRoutingModule } from './cliente-perfil-aclaramiento-routing.module';
import { ClientePerfilAclaramientoComponent } from './cliente-perfil-aclaramiento.component';
import {SharedModule} from "../../../theme/shared/shared.module";
import {DataTablesModule} from "angular-datatables";
import {NgbModalModule, NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {HistoriaClinicaModule} from "../cliente-perfil-componentes/historia-clinica/historia-clinica.module";
import {ContratosModule} from "../cliente-perfil-componentes/contratos/contratos.module";
import {
  EvolucionTratamientoModule
} from "../cliente-perfil-componentes/evolucion-tratamiento/evolucion-tratamiento.module";
import {DocumentosClienteModule} from "../cliente-perfil-componentes/documentos/documentos-cliente.module";
import {DocumentoAnulacionModule} from "../../documento/documento/documento-anulacion/documento-anulacion.module";


@NgModule({
  declarations: [ClientePerfilAclaramientoComponent],
  imports: [
    CommonModule,
    ClientePerfilAclaramientoRoutingModule,
    SharedModule,
    DataTablesModule,
    NgbTooltipModule,
    NgbModalModule,
    HistoriaClinicaModule,
    ContratosModule,
    EvolucionTratamientoModule,
    DocumentosClienteModule,
    DocumentoAnulacionModule
  ],
  exports: [ClientePerfilAclaramientoComponent],
  providers: [],
  bootstrap: [ClientePerfilAclaramientoComponent]
})
export class ClientePerfilAclaramientoModule { }
