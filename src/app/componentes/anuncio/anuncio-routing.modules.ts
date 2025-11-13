import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnuncioGaleriaComponent } from './anuncio-galeria/anuncio-galeria.component';
import { AnuncioDatosComponent } from './anuncio-datos/anuncio-datos.component';

const routes: Routes = [
    {   path: '', component: AnuncioGaleriaComponent,
        children: [
            { path: '', component: AnuncioGaleriaComponent },
            { path: 'add', component: AnuncioDatosComponent },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AnuncioRoutingModule { }