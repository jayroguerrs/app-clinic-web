import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {VentasComponent} from "./ventas.component";
import { VentasRoutingModule } from './ventas-routing.module';
import {SharedModule} from "../../theme/shared/shared.module";
import {NgSelectModule} from "@ng-select/ng-select";
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [VentasComponent],
  imports: [
    CommonModule,
    VentasRoutingModule,
    SharedModule,
    NgSelectModule,
    NgbTooltipModule,
    FormsModule
],
  exports: [VentasComponent],
  bootstrap: [VentasComponent]
})
export class VentasModule { }
