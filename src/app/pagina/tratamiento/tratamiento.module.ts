import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import {NgxSpinnerModule} from "ngx-spinner";
import {SharedModule} from "../../theme/shared/shared.module";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {MatRippleModule} from "@angular/material/core";
import {DataTablesModule} from "angular-datatables";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {TratamientoComponent} from "./tratamiento.component";
import {TratamientoRoutingModule} from "./tratamiento-routing.module";
import {MdlTratamientoModule} from "../../componentes/modals/mdl-tratamiento/mdl-tratamiento.module";


@NgModule({
  declarations: [TratamientoComponent],
  imports: [
    CommonModule,
    TratamientoRoutingModule,
    NgxSpinnerModule,
    SharedModule,
    NgbTooltipModule,
    MatRippleModule,
    DataTablesModule,
    MatBottomSheetModule,
    MdlTratamientoModule
  ],
  exports: [TratamientoComponent],
  providers: [],
  bootstrap: [TratamientoComponent]
})
export class TratamientoModule { }
