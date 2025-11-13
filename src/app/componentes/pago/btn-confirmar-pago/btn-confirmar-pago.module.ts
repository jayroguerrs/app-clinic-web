import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtnConfirmarPagoComponent } from './btn-confirmar-pago.component';
import { MypipesModule } from '../../../shared/pipe/mypipes.module';



@NgModule({
  declarations: [BtnConfirmarPagoComponent],
  imports: [
    CommonModule,
    MypipesModule
  ],
  exports: [BtnConfirmarPagoComponent]
})
export class BtnConfirmarPagoModule { }
