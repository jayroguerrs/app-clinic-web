import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../../../theme/shared/shared.module";
import {DataTablesModule} from "angular-datatables";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {NgxSpinnerModule} from "ngx-spinner";
import {ClienteModule} from "../../../cliente/cliente.module";
import {ZonaCorporalSeleccionarModule} from "../../../zona-corporal/zona-corporal-seleccionar/zona-corporal-seleccionar.module";
import {DocumentoDatosComponent} from "./documento-datos.component";
import {NgSelectModule} from "@ng-select/ng-select";



@NgModule({
  declarations: [DocumentoDatosComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    DataTablesModule,
    NgbTooltipModule,
    FormsModule,
    NgxSpinnerModule,
    ClienteModule,
    ZonaCorporalSeleccionarModule,
    NgSelectModule,
    
  ],
  exports: [ DocumentoDatosComponent ],
  providers: [DatePipe],
  bootstrap: [ DocumentoDatosComponent ]
})
export class DocumentoDatosModule { }
