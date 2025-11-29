import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MdlCambiarClaveComponent } from './mdl-cambiar-clave.component';

@NgModule({
  declarations: [
    MdlCambiarClaveComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModule,
    NgxSpinnerModule
  ],
  exports: [
    MdlCambiarClaveComponent
  ]
})
export class MdlCambiarClaveModule { }
