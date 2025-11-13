import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TiposFiltrosClientePipe } from './tipos-filtros-cliente.pipe';
import { TipoComprobantePipe } from './tipo-comprobante.pipe';
import { TipodepagoPipe } from './tipodepago.pipe';



@NgModule({
  declarations: [TiposFiltrosClientePipe, TipoComprobantePipe, TipodepagoPipe, TipodepagoPipe],
  imports: [
    CommonModule
  ],
  exports: [TiposFiltrosClientePipe, TipoComprobantePipe, TipodepagoPipe],
})
export class MypipesModule { }
