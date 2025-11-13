import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from '../../../theme/shared/shared.module';
import { CitaListadoComponent } from './cita-listado.component';
import { CitaListadoRoutingModule } from './cita-listado-routing.module';
import { CitaRegistroModule } from '../cita-registro/cita-registro.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TicketModule } from '../../Ticket/ticket.module';
import { CitaItemListadoComponent, DialogContentExampleDialog } from './cita-item-listado/cita-item-listado.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CitaHistoriasComponent } from './cita-historias/cita-historias.component';
import {StickyClassDirectiveModule} from "../../../shared/directive/sticky-class.directive";
import {MatListModule} from "@angular/material/list";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {DragDropModule} from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from "@angular/material/icon";
import {MdlVisualizarTacoModule} from "../../modals/mdl-visualizar-taco/mdl-visualizar-taco.module";
import {MdlEmisionComprobanteModule} from "../../modals/mdl-emision-comprobante/mdl-emision-comprobante.module";
import {MdlPdfGoogleViewModule} from "../../modals/mdl-pdf-google-view/mdl-pdf-google-view.module";
import {FontawesomeSvgModule} from "../../fontawesome-svg/fontawesome-svg.module";
import {MatRippleModule} from "@angular/material/core";
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    imports: [CommonModule,
        ReactiveFormsModule,
        CitaListadoRoutingModule,
        SharedModule,
        DataTablesModule,
        FormsModule,
        CitaRegistroModule,
        NgbTooltipModule,
        TicketModule,
        NgxSpinnerModule,
        StickyClassDirectiveModule,
        NgSelectModule,
        MatListModule,
        MatBottomSheetModule,
        DragDropModule,
        MatButtonModule,
        MatIconModule,
        MdlVisualizarTacoModule,
        MdlEmisionComprobanteModule,
        MdlPdfGoogleViewModule,
        FontawesomeSvgModule,
        MatRippleModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule
    ],
    declarations: [
        CitaListadoComponent,
        CitaItemListadoComponent,
        CitaHistoriasComponent,
        DialogContentExampleDialog
    ],
    exports: [
        CitaHistoriasComponent
    ]
})
export class CitaListadoModule {}
