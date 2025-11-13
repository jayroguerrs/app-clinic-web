import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ControlDeCitasRoutingModule } from './control-de-citas-routing.module';
import { ControlDeCitasComponent } from './control-de-citas.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from "../../../theme/shared/shared.module";
import { CardModule } from "../../../theme/shared/components/card/card.module";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CitasCerradasComponent, EditarPagoFinalDialog } from './citas-cerradas/citas-cerradas.component';
import { getDutchPaginatorIntl } from '../../../shared/clases/paginador-espanol';
import { MatSortModule } from '@angular/material/sort';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTreeModule } from '@angular/material/tree';
import { CdkTreeModule } from '@angular/cdk/tree';
import { ComisionComponent } from './citas-cerradas/comision/comision.component';
@NgModule({
  declarations: [
    ControlDeCitasComponent,
    CitasCerradasComponent,
    EditarPagoFinalDialog,
    ComisionComponent
  ], 
  imports: [
    CommonModule,
    ControlDeCitasRoutingModule,
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
    CdkTreeModule
],
providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-ES' }, { provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl() }, { provide: LOCALE_ID, useValue: 'es' }, DatePipe]
})
export class ControlDeCitasModule { }

