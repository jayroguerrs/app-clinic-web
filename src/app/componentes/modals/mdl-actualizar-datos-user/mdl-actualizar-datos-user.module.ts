import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdlActualizarDatosUserComponent } from './mdl-actualizar-datos-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CellMaskDirective, CellMaskDirectiveModule } from '../../../shared/directive/cell-mask.directive';



@NgModule({
  declarations: [
    MdlActualizarDatosUserComponent,
    // CellMaskDirective
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CellMaskDirectiveModule,
    FormsModule
  ],
  exports: [
    MdlActualizarDatosUserComponent
  ]
})
export class MdlActualizarDatosUserModule { }
