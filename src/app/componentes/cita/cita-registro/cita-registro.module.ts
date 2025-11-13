import { LOCALE_ID, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, registerLocaleData } from '@angular/common';
import { SharedModule } from '../../../theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CitaRegistroComponent, PagoFinalDialog } from './cita-registro.component';
import {NgbAccordionModule, NgbCarouselModule, NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import { AngularDualListBoxModule} from 'angular-dual-listbox';
import { TagInputModule} from 'ngx-chips';
//import { SignaturePadModule } from 'angular2-signaturepad';
import { AmazingTimePickerModule} from 'amazing-time-picker';
import { ColorPickerModule} from 'ngx-color-picker';
import { NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';
import {  SelectOptionService } from '../../../theme/shared/components/select/select-option.service';
import { CitaHistorialComponent } from '../cita-historial/cita-historial.component';
import { CitaRegistroRoutingModule } from './cita-registro-routing.module';
import localeEs from '@angular/common/locales/es-PE';
import { CitaCondicionEstadoModule } from '../cita-condicion-estado/cita-condicion-estado.module';
import { UsuarioSeleccionModule } from '../../usuario/usuario-seleccion/usuario-seleccion.module'
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxCurrencyModule } from 'ngx-currency';
import { CitaHorarioModule } from '../cita-horario/cita-horario.module';
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatButtonModule} from "@angular/material/button";
import {CitaMedicionEstadoModule} from "../cita-medicion-estado/cita-medicion-estado.module";
import {EvolucionTratamientoDatosModalModule} from "../evolucion-tratamiento-datos-modal/evolucion-tratamiento-datos-modal.module";
import {CitaCuponZonaModule} from "../cita-cupon-zona/cita-cupon-zona.module";
import {MatRippleModule} from "@angular/material/core";
import {MdlFechaCitaAsignadaModule} from "../../modals/mdl-fecha-cita-asignada/mdl-fecha-cita-asignada.module";
import {MdlSiguienteCitaModule} from "../../modals/mdl-siguiente-cita/mdl-siguiente-cita.module";
import {FontawesomeSvgModule} from "../../fontawesome-svg/fontawesome-svg.module";
import { CitaHorarioComponent } from '../cita-horario/cita-horario.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AutocompleteSelectModule } from '../../../shared/components/autocomplete-select/autocomplete-select.module';
import { CronometroModule } from '../../widgets/cronometro/cronometro.module';
import { SubmdlSeleccionarZonaModule } from '../../modals/submodals/submdl-seleccionar-zona/submdl-seleccionar-zona.module';
import { MdlFotosParametrosCitaModule } from '../../modals/mdl-fotos-parametros-cita/mdl-fotos-parametros-cita.module';
import { MdlHistorialParametrosModule } from '../../modals/mdl-historial-parametros/mdl-historial-parametros.module';
import { MdlParametrosCitaRegistroModule } from '../../modals/mdl-parametros-cita-registro/mdl-parametros-cita-registro.module';
import { MdlTipoDePagoModule } from '../../modals/mdl-tipo-de-pago/mdl-tipo-de-pago.module';
import { MypipesModule } from '../../../shared/pipe/mypipes.module';

registerLocaleData(localeEs, 'es');

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CitaRegistroRoutingModule,
        SharedModule,
        DataTablesModule,
        FormsModule,
        IonicModule,
        //SignaturePadModule,
        AngularDualListBoxModule,
        TagInputModule,
        AmazingTimePickerModule,
        ColorPickerModule,
        NgbDatepickerModule,
        NgbTooltipModule,
        NgbCarouselModule,
        CitaCondicionEstadoModule,
        UsuarioSeleccionModule,
        NgxSpinnerModule,
        NgxCurrencyModule,
        CitaHorarioModule,
        EvolucionTratamientoDatosModalModule,

        MatListModule,
        MatBottomSheetModule,
        DragDropModule,
        MatButtonModule,
        MatIconModule,
        CitaMedicionEstadoModule,

        CitaCuponZonaModule,
        MatRippleModule,
        MdlFechaCitaAsignadaModule,
        MdlSiguienteCitaModule,
        FontawesomeSvgModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule ,
        MatCheckboxModule,

        AutocompleteSelectModule,

        NgbDropdownModule,
        NgbAccordionModule,
        CronometroModule,

        SubmdlSeleccionarZonaModule,
        MdlFotosParametrosCitaModule,
        MdlHistorialParametrosModule,
        MdlTipoDePagoModule,
        MypipesModule
    ],
    declarations: [
        CitaRegistroComponent,
        CitaHistorialComponent,
        PagoFinalDialog
    ],
    providers: [
        SelectOptionService,
        { provide: LOCALE_ID, useValue: 'es' }
        ],
    exports: [
        CitaRegistroComponent
    ],
    entryComponents: [ CitaHorarioComponent ]
})
export class CitaRegistroModule { }
