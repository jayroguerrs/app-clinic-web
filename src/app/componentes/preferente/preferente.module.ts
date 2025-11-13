import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PreferenteRoutingModule } from './preferente-routing.module';
import { SharedModule } from '../../theme/shared/shared.module';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { DataTablesModule } from 'angular-datatables';
import { PreferenteListadoComponent } from './preferente-listado/preferente-listado.component';
import { PreferenteDatosComponent } from './preferente-datos/preferente-datos.component';
import { PreferenteTelefonosComponent } from './preferente-telefonos/preferente-telefonos.component';
import { PreferenteUbigeoComponent } from './preferente-ubigeo/preferente-ubigeo.component';
import { PreferenteZonaCorporalComponent } from './preferente-zona-corporal/preferente-zona-corporal.component';
import { PreferenteAsignarComponent } from './preferente-asignar/preferente-asignar.component';
import { PreferenteObservacionComponent } from './preferente-observacion/preferente-observacion.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { PreferenteTablaComponent } from './preferente-tabla/preferente-tabla.component';
import { SafeHtmlPipe } from '../../shared/pipe/safe-html.pipe';
import { TagInputModule } from 'ngx-chips';
import localeEs from '@angular/common/locales/es-PE';
import { PreferenteAtencionComponent } from './preferente-atencion/preferente-atencion.component';
import { CellMaskDirectiveModule } from '../../shared/directive/cell-mask.directive';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MatListModule} from "@angular/material/list";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatIconModule} from "@angular/material/icon";
import {PreferenteAsignarOperadorComponent} from "./preferente-asignar-operador/preferente-asignar-operador.component";
import {MatRippleModule} from "@angular/material/core";
import {PreferenteClienteModule} from "./preferente-cliente/preferente-cliente.module";
import {MdlAgendarCitaModule} from "../modals/mdl-agendar-cita/mdl-agendar-cita.module";
import {FontawesomeSvgModule} from "../fontawesome-svg/fontawesome-svg.module";
import {NgSelectModule} from "@ng-select/ng-select";
import {MdlPreferenteReasignarModule} from "../modals/mdl-preferente-reasignar/mdl-preferente-reasignar.module";
import {MdlPreferenteHistorial2Module} from "../modals/mdl-preferente-historial2/mdl-preferente-historial2.module";
import {MdlBuscarPreferenteModule} from "../modals/mdl-buscar-preferente/mdl-buscar-preferente.module";
import {MdlBuscarPreferenteComponent} from "../modals/mdl-buscar-preferente/mdl-buscar-preferente.component";
import {MdlDateRangeFilterModule} from "../modals/mdl-date-range-filter/mdl-date-range-filter.module";
import { PreferenteMobileListadoComponent } from './preferente-listado/preferente-mobile-listado/preferente-mobile-listado.component';
// Importación para autocomplete
import { MatAutocompleteModule } from '@angular/material/autocomplete';

registerLocaleData(localeEs, 'es');

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PreferenteRoutingModule,
    SharedModule,
    DataTablesModule,
    MatInputModule,
    MatButtonModule,
    NgbTooltipModule,
    TagInputModule,
    CellMaskDirectiveModule,
    NgxSpinnerModule,

    MatListModule,
    MatBottomSheetModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    PreferenteClienteModule,
    MdlAgendarCitaModule,
    FontawesomeSvgModule,
    MdlPreferenteHistorial2Module,
    NgSelectModule,
    MdlPreferenteReasignarModule,
    MdlBuscarPreferenteModule,
    MdlDateRangeFilterModule,
    MatAutocompleteModule, // Para autocomplete
    MatSelectModule // Para select
 
  ],
  declarations: [
    PreferenteListadoComponent,
    PreferenteDatosComponent,
    PreferenteTelefonosComponent,
    PreferenteUbigeoComponent,
    PreferenteZonaCorporalComponent,
    PreferenteAsignarComponent,
    PreferenteObservacionComponent,
    PreferenteTablaComponent,
    //PreferenteClienteComponent,
    SafeHtmlPipe,
    PreferenteAtencionComponent,
    PreferenteAsignarOperadorComponent,
    PreferenteMobileListadoComponent
  ],
  exports: [
    PreferenteUbigeoComponent
  ],
  providers: [ { provide: LOCALE_ID, useValue: 'es' } ]
})
export class PreferenteModule { }
