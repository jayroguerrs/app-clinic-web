import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientePerfilGlobalComponent } from "./cliente-perfil-global.component";

// import { ClientePerfilLaserRoutingModule } from './cliente-perfil-laser-routing.module';
// import { ClientePerfilLaserComponent } from './cliente-perfil-laser.component';
import {SharedModule} from "../../../theme/shared/shared.module";
import {DataTablesModule} from "angular-datatables";
import {NgbModalModule, NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {HistoriaClinicaModule} from "../cliente-perfil-componentes/historia-clinica/historia-clinica.module";
import {ContratosModule} from "../cliente-perfil-componentes/contratos/contratos.module";
import {EvolucionTratamientoModule} from "../cliente-perfil-componentes/evolucion-tratamiento/evolucion-tratamiento.module";
import {DocumentosClienteModule} from "../cliente-perfil-componentes/documentos/documentos-cliente.module";
import {DocumentoAnulacionModule} from "../../documento/documento/documento-anulacion/documento-anulacion.module";
import {TblClienteFinanciamientoModule} from "../../tables/tbl-cliente-financiamiento/tbl-cliente-financiamiento.module";
import { TablaClientePerfilGlobalComponent } from './tabla-cliente-perfil-global/tabla-cliente-perfil-global.component';



@NgModule({
  declarations: [ClientePerfilGlobalComponent, TablaClientePerfilGlobalComponent],
  imports: [
    CommonModule,
    SharedModule,
    DataTablesModule,
    NgbTooltipModule,
    NgbModalModule,
    HistoriaClinicaModule,
    ContratosModule,
    EvolucionTratamientoModule,
    DocumentosClienteModule,
    DocumentoAnulacionModule,
    TblClienteFinanciamientoModule
  ],
  exports: [ClientePerfilGlobalComponent],
  providers: [],
  bootstrap: [ClientePerfilGlobalComponent]
})
export class ClientePerfilGlobalModule { }
