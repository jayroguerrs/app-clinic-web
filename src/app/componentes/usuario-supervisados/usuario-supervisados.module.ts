import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuarioSupervisadosRoutingModule } from './usuario-supervisados-routing.module';
import {SelectOptionService} from '../../theme/shared/components/select/select-option.service';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
// import { UsuarioRoutingModule } from './usuario-routing.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {MdlVerClaveModule} from "../modals/mdl-ver-clave/mdl-ver-clave.module";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UsuarioSupervisadosRoutingModule,

    CommonModule,
    ReactiveFormsModule,
    // UsuarioRoutingModule,
    SharedModule,
    DataTablesModule,
    NgbTooltipModule,
    FormsModule,
    NgxSpinnerModule,
    MatIconModule,

    MatListModule,
    MatBottomSheetModule,
    MdlVerClaveModule
  ],
  providers: [SelectOptionService]
})
export class UsuarioSupervisadosModule { }
