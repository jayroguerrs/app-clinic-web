import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RespuestaTablaComponent} from "./respuesta-tabla.component";
import {DataTablesModule} from "angular-datatables";



@NgModule({
  declarations: [RespuestaTablaComponent],
  imports: [
    CommonModule,
    DataTablesModule
  ],
  exports: [RespuestaTablaComponent],
  providers: [],
  bootstrap: [RespuestaTablaComponent]
})
export class RespuestaTablaModule { }
