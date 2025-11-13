import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../../theme/shared/shared.module";
import {NgbAccordionModule, NgbCarouselModule, NgbCollapseModule, NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {NgxSpinnerModule} from "ngx-spinner";
import {MatRadioModule} from "@angular/material/radio";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {EvolucionTratamientoDatosModalComponent} from "./evolucion-tratamiento-datos-modal.component";
import {EvolucionTratamientoDetallesComponent} from "./evolucion-tratamiento-detalles/evolucion-tratamiento-detalles.component";
import {UsuarioSeleccionModule} from "../../usuario/usuario-seleccion/usuario-seleccion.module";


@NgModule({
  declarations: [EvolucionTratamientoDatosModalComponent, EvolucionTratamientoDetallesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgbTooltipModule,
    NgbCarouselModule,
    NgxSpinnerModule,
    MatRadioModule,
    MatListModule,
    MatIconModule,
    NgbAccordionModule,
    NgbCollapseModule,
    UsuarioSeleccionModule
  ],
  exports: [ EvolucionTratamientoDatosModalComponent, EvolucionTratamientoDetallesComponent],
  providers: [],
  bootstrap: [ EvolucionTratamientoDatosModalComponent, EvolucionTratamientoDetallesComponent ]
})
export class EvolucionTratamientoDatosModalModule { }
