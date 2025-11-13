import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { TicketRoutingModule} from './ticket-routing.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TicketAnularComponent } from './anular/anular-ticket.component';
import { TicketEmisionComponent } from './ticket-emision/ticket-emision.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { TicketListadoComponent } from './ticket-listado/ticket-listado.component';
import { UsuarioSeleccionModule } from '../usuario/usuario-seleccion/usuario-seleccion.module';
import {MatButtonModule} from "@angular/material/button";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        DataTablesModule,
        FormsModule,
        IonicModule,
        TicketRoutingModule,
        NgbTooltipModule,
        NgxCurrencyModule,
        UsuarioSeleccionModule,

        MatButtonModule,
        MatBottomSheetModule,
        MatIconModule,
        MatListModule
    ],
    declarations: [
        TicketEmisionComponent,
        TicketAnularComponent,
        TicketListadoComponent
    ],
    exports: [
        TicketEmisionComponent
    ]
})
export class TicketModule { }
