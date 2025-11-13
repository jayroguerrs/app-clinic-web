import { LOCALE_ID, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {CommonModule, DatePipe, registerLocaleData} from '@angular/common';
import { SharedModule } from '../../../theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { ClientePerfilRoutingModule } from './cliente-perfil-routing.module';
import { PerfilClienteComponent } from './cliente-perfil.component';
import {NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import { AngularDualListBoxModule} from 'angular-dual-listbox';
import { TagInputModule} from 'ngx-chips';
import { AmazingTimePickerModule} from 'amazing-time-picker';
import { ColorPickerModule} from 'ngx-color-picker';
import { NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import localeEs from '@angular/common/locales/es-PE';
import { NgxSpinnerModule } from 'ngx-spinner';
import {DocumentoAnulacionModule} from "../../documento/documento/documento-anulacion/documento-anulacion.module";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {DocumentoDatosModule} from "../../documento/documento/documento-datos/documento-datos.module";
import {MatListModule} from "@angular/material/list";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatIconModule} from "@angular/material/icon";
import {ClienteContratoComponent} from "../cliente-contrato/cliente-contrato.component";
import {EvolucionTratamientoDatosModalModule} from "../../cita/evolucion-tratamiento-datos-modal/evolucion-tratamiento-datos-modal.module";
import {ClienteHistoriaClinicaComponent} from "../cliente-historia-clinica/cliente-historia-clinica.component";
import {ClienteEncuestaComponent} from "../cliente-encuesta/cliente-encuesta.component";
import {ClienteEncuestaLinkComponent} from "../cliente-encuesta-link/cliente-encuesta-link.component";

import { AutocompleteSelectModule } from '../../../shared/components/autocomplete-select/autocomplete-select.module';
import {EditarFichaAdmisionComponent} from "../cliente-perfil-componentes/editar-ficha-admision/editar-ficha-admision.component";
import {MatRippleModule} from "@angular/material/core";
import {ClienteEncuestaVerComponent} from "../cliente-encuesta-ver/cliente-encuesta-ver.component";
import {IncidenciaModalModule} from "../../../pagina/incidencia/incidencia-modal/incidencia-modal.module";
import {ModalClienteIncidenciasModule} from "../modal-cliente-incidencias/modal-cliente-incidencias.module";
import {HistoriaClinicaModule} from "../cliente-perfil-componentes/historia-clinica/historia-clinica.module";
import {ContratosModule} from "../cliente-perfil-componentes/contratos/contratos.module";
import {
  EvolucionTratamientoModule
} from "../cliente-perfil-componentes/evolucion-tratamiento/evolucion-tratamiento.module";
import {DocumentosClienteModule} from "../cliente-perfil-componentes/documentos/documentos-cliente.module";
import {MdlAgendarCitaModule} from "../../modals/mdl-agendar-cita/mdl-agendar-cita.module";
import { PurchaseHistoryComponent } from './purchase-history/purchase-history.component';

registerLocaleData(localeEs, 'es');

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ClientePerfilRoutingModule,
        SharedModule,
        DataTablesModule,
        FormsModule,
        AngularDualListBoxModule,
        TagInputModule,
        AmazingTimePickerModule,
        ColorPickerModule,
        NgbDatepickerModule,
        NgbTooltipModule,
        NgbDropdownModule,
        MatInputModule,
        MatButtonModule,
        NgxSpinnerModule,
        DocumentoAnulacionModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        DocumentoDatosModule,
        MatListModule,
        MatBottomSheetModule,
        DragDropModule,
        MatButtonModule,
        MatIconModule,
        EvolucionTratamientoDatosModalModule,
        AutocompleteSelectModule,
        MatRippleModule,
        IncidenciaModalModule,
        ModalClienteIncidenciasModule,
        HistoriaClinicaModule,
        ContratosModule,
        EvolucionTratamientoModule,
        DocumentosClienteModule,
        MdlAgendarCitaModule
    ],
    declarations: [
      PerfilClienteComponent,
      ClienteContratoComponent,
      ClienteHistoriaClinicaComponent,
      ClienteEncuestaComponent,
      ClienteEncuestaLinkComponent,
      EditarFichaAdmisionComponent,
      ClienteEncuestaVerComponent,
      PurchaseHistoryComponent,
    ],
    providers: [{ provide: LOCALE_ID, useValue: 'es' },DatePipe]
})
export class ClientePerfilModule { }
