import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientePerfilCorporal360Component } from './cliente-perfil-corporal360.component';
import {ClientePerfilCorporal360RoutingModule} from "./cliente-perfil-corporal360-routing.module";
import {TblClienteCronogramasModule} from "../../../corporal360/componente/tables/tbl-cliente-cronogramas/tbl-cliente-cronogramas.module";
import {DocumentosClienteModule} from "../cliente-perfil-componentes/documentos/documentos-cliente.module";
import {DocumentoAnulacionModule} from "../../documento/documento/documento-anulacion/documento-anulacion.module";
import {ContratosModule} from "../cliente-perfil-componentes/contratos/contratos.module";
import {SharedModule} from "../../../theme/shared/shared.module";
import {DataTablesModule} from "angular-datatables";
import {NgbTooltip, NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";


@NgModule({
  declarations: [ClientePerfilCorporal360Component],
  imports: [
    CommonModule,
    ClientePerfilCorporal360RoutingModule,
    TblClienteCronogramasModule,
    DocumentosClienteModule,
    DocumentoAnulacionModule,
    ContratosModule,
    SharedModule,
    DataTablesModule,
    NgbTooltipModule
  ],
  exports: [ClientePerfilCorporal360Component],
  providers: [],
  bootstrap: [ClientePerfilCorporal360Component]
})
export class ClientePerfilCorporal360Module { }
