import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { EncuestaClientesComponent } from './encuesta-clientes.component';
import {IonicModule} from "@ionic/angular";
import {DataTablesModule} from "angular-datatables";
import {SharedModule} from "../../../../theme/shared/shared.module";


@NgModule({
  declarations: [EncuestaClientesComponent],
  imports: [
    IonicModule,
    CommonModule,
    DataTablesModule,
    SharedModule
  ],
  exports: [EncuestaClientesComponent],
  providers: [DatePipe],
  bootstrap: [EncuestaClientesComponent]
})

export class EncuestaClientesModule { }
