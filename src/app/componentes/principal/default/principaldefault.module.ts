import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { PrincipalDefaultRoutingModule } from './principaldefault-routing.module';
import { PrincipalDefaultComponent  } from './principaldefault.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { CardModule } from "../../../theme/shared/components/card/card.module";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { getDutchPaginatorIntl } from '../../../shared/clases/paginador-espanol';
import { MatSortModule } from '@angular/material/sort';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTreeModule } from '@angular/material/tree';
import { CdkTreeModule } from '@angular/cdk/tree';
import { BusquedaClienteComponent } from './busqueda-cliente/busqueda-cliente.component';
import { BusquedaNumeroComponent } from './busqueda-numero/busqueda-numero.component';
import { TiposFiltrosClientePipe } from '../../../shared/pipe/tipos-filtros-cliente.pipe';
import { MypipesModule } from '../../../shared/pipe/mypipes.module';
import { TblBusquedaIdcitaComponent } from './tbl-busqueda-idcita/tbl-busqueda-idcita.component';
import { TicketModule } from '../../Ticket/ticket.module';
import { CitaListadoModule } from '../../cita/cita-listado/cita-listado.module';
import { FontawesomeSvgModule } from '../../fontawesome-svg/fontawesome-svg.module';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BtnConfirmarPagoModule } from '../../pago/btn-confirmar-pago/btn-confirmar-pago.module';
import { MdlActualizarDatosUserModule } from '../../modals/mdl-actualizar-datos-user/mdl-actualizar-datos-user.module';
@NgModule({
  imports: [
    CommonModule,
    PrincipalDefaultRoutingModule,
    SharedModule,
    NgxSpinnerModule,
    FormsModule,

    CommonModule,
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
    MypipesModule,

    TicketModule,
    CitaListadoModule,
    FontawesomeSvgModule,
    ZXingScannerModule,
    BtnConfirmarPagoModule,
    MdlActualizarDatosUserModule
  ],
  declarations: [PrincipalDefaultComponent, BusquedaClienteComponent, BusquedaNumeroComponent, TblBusquedaIdcitaComponent ],
  exports: [PrincipalDefaultComponent],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-ES' }, { provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl() }, { provide: LOCALE_ID, useValue: 'es' }, DatePipe],
  bootstrap: [PrincipalDefaultComponent]
})
export class PrincipalDefaultModule { }
