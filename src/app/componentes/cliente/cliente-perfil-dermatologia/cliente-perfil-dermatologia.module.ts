import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {TblClienteCronogramasModule} from "../../../corporal360/componente/tables/tbl-cliente-cronogramas/tbl-cliente-cronogramas.module";
import {DocumentosClienteModule} from "../cliente-perfil-componentes/documentos/documentos-cliente.module";
import {DocumentoAnulacionModule} from "../../documento/documento/documento-anulacion/documento-anulacion.module";
import {ContratosModule} from "../cliente-perfil-componentes/contratos/contratos.module";
import {SharedModule} from "../../../theme/shared/shared.module";
import {DataTablesModule} from "angular-datatables";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {ClientePerfilDermatologiaComponent} from "./cliente-perfil-dermatologia.component";
import {ClientePerfilDermatologiaRoutingModule} from "./cliente-perfil-dermatologia-routing.module";


@NgModule({
  declarations: [ClientePerfilDermatologiaComponent],
  imports: [
    CommonModule,
    ClientePerfilDermatologiaRoutingModule,
    DocumentosClienteModule,
    DocumentoAnulacionModule,
    ContratosModule,
    SharedModule,
    DataTablesModule,
    NgbTooltipModule
  ],
  exports: [ClientePerfilDermatologiaComponent],
  providers: [],
  bootstrap: [ClientePerfilDermatologiaComponent]
})
export class ClientePerfilDermatologiaModule { }
