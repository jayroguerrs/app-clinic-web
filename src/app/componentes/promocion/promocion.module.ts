import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PromocionRoutingModule } from './promocion-routing.module';
import { PromocionListadoComponent } from './promocion-listado/promocion-listado.component';
import { SharedModule } from '../../theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { PromocionDatosComponent } from './promocion-datos/promocion-datos.component';
import { PromocionPlantillaComponent } from './promocion-plantilla/promocion-plantilla.component';
import { PromocionPrecioComponent } from './promocion-precio/promocion-precio.component';
import { NgbAccordionModule, NgbCollapseModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { PromocionAyudaPlantillaComponent } from './promocion-ayuda-plantilla/promocion-ayuda-plantilla.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MatListModule} from "@angular/material/list";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        PromocionRoutingModule,
        SharedModule,
        DataTablesModule,
        NgbTooltipModule,
        NgbCollapseModule,
        NgbAccordionModule,
        NgxSpinnerModule,

        MatListModule,
        MatBottomSheetModule,
        DragDropModule,
        MatButtonModule,
        MatIconModule
    ],
    declarations: [
        PromocionListadoComponent,
        PromocionDatosComponent,
        PromocionDatosComponent,
        PromocionPlantillaComponent,
        PromocionPrecioComponent,
        PromocionAyudaPlantillaComponent,
    ]
})
export class PromocionModule { }
