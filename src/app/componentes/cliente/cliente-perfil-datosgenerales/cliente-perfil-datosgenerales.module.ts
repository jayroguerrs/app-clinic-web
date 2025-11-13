import { ClientePerfilDatosgeneralesRoutingModule } from './cliente-perfil-datosgenerales-routing.module';
import { ClientePerfilDatosgeneralesComponent } from './cliente-perfil-datosgenerales.component';
import {MatRippleModule} from "@angular/material/core";
import { CitasClientePerfilComponent } from './citas-cliente-perfil/citas-cliente-perfil.component';

import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { CardModule } from "../../../theme/shared/components/card/card.module";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { getDutchPaginatorIntl } from '../../../shared/clases/paginador-espanol';
import { MatSortModule } from '@angular/material/sort';
import { NgbAccordionModule, NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';

// import { MatButtonModule } from '@angular/material/button';
// import { MatInputModule } from '@angular/material/input';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { MatTreeModule } from '@angular/material/tree';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MypipesModule } from '../../../shared/pipe/mypipes.module';
import { ClientePerfilGlobalModule } from '../cliente-perfil-global/cliente-perfil-global.module';
import { ZonasAtendidasComponent } from './zonas-atendidas/zonas-atendidas.component';
import { TblClienteFinanciamientoModule } from '../../tables/tbl-cliente-financiamiento/tbl-cliente-financiamiento.module';
import { DocumentosClienteModule } from '../cliente-perfil-componentes/documentos/documentos-cliente.module';
import { DocumentoAnulacionModule } from '../../documento/documento/documento-anulacion/documento-anulacion.module';
import { EvolucionTratamientoModule } from '../cliente-perfil-componentes/evolucion-tratamiento/evolucion-tratamiento.module';
import { ContratosModule } from '../cliente-perfil-componentes/contratos/contratos.module';
import { HistoriaClinicaModule } from '../cliente-perfil-componentes/historia-clinica/historia-clinica.module';
import { DataTablesModule } from 'angular-datatables';
import { BtnConfirmarPagoModule } from '../../pago/btn-confirmar-pago/btn-confirmar-pago.module';

@NgModule({
  declarations: [ClientePerfilDatosgeneralesComponent, CitasClientePerfilComponent, ZonasAtendidasComponent],
  imports: [
    CommonModule,
    ClientePerfilDatosgeneralesRoutingModule,
    MatRippleModule,
    MypipesModule,
    SharedModule,
    NgxSpinnerModule,
    FormsModule,

    MatTableModule,
    MatPaginatorModule,
    SharedModule,
    MatPaginatorModule,
    CardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatDividerModule,
    MatSortModule,
    NgbTooltipModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatButtonModule,
    MatTreeModule,
    CdkTreeModule,

    NgbAccordionModule,
    ClientePerfilGlobalModule,

    DataTablesModule,
    NgbModalModule,
    HistoriaClinicaModule,
    ContratosModule,
    EvolucionTratamientoModule,
    DocumentosClienteModule,
    DocumentoAnulacionModule,
    TblClienteFinanciamientoModule,

    BtnConfirmarPagoModule
  ],
  exports: [ClientePerfilDatosgeneralesComponent],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-ES' }, { provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl() }, { provide: LOCALE_ID, useValue: 'es' }, DatePipe],
  bootstrap: [ClientePerfilDatosgeneralesComponent]
})
export class ClientePerfilDatosgeneralesModule { }
