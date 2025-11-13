import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoxListadoRoutingModule } from './box-listado-routing.module';
import { BoxListadoComponent } from './box-listado.component';
import { CardModule } from '../../../theme/shared/components/card/card.module';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ModalModule } from '../../../theme/shared/components/modal/modal.module';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdlAddBoxModule } from '../../modals/mdl-add-box/mdl-add-box.module';
import { ListaDeEsperaComponent } from './lista-de-espera/lista-de-espera.component';

@NgModule({
  declarations: [BoxListadoComponent, ListaDeEsperaComponent],
  imports: [
    CommonModule,
    BoxListadoRoutingModule,
    CardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    NgbTooltipModule ,
    MatButtonModule,
    MatIconModule,
    ModalModule,
    DragDropModule,
    FormsModule,
    // MdlAddBoxModule,
    ReactiveFormsModule
  ]
})
export class BoxListadoModule { }
