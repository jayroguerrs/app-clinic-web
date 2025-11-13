import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables'
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {PromocionCategoriaComponent} from "./promocion-categoria.component";
import {PromocionCategoriaRoutingModule} from "./promocion-categoria-routing.module";
import {MdlPromocionCategoriaModule} from "../../componentes/modals/mdl-promocion-categoria/mdl-promocion-categoria.module";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        PromocionCategoriaRoutingModule,
        SharedModule,
        DataTablesModule,
        NgbTooltipModule,
        NgxSpinnerModule,

        MatListModule,
        MatBottomSheetModule,
        DragDropModule,
        MatButtonModule,
        MatIconModule,
        MdlPromocionCategoriaModule
    ],
    declarations: [
        PromocionCategoriaComponent
    ]
})
export class PromocionCategoriaModule { }
