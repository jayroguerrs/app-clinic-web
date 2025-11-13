import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../theme/shared/shared.module';
import { AnuncioGaleriaComponent } from './anuncio-galeria/anuncio-galeria.component';
import { AnuncioDatosComponent } from './anuncio-datos/anuncio-datos.component';
import { AnuncioRoutingModule } from './anuncio-routing.modules';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AnuncioRoutingModule,
        SharedModule,
        NgbTooltipModule
    ],
    declarations: [
        AnuncioGaleriaComponent,
        AnuncioDatosComponent
    ]
})
export class AnuncioModule { }