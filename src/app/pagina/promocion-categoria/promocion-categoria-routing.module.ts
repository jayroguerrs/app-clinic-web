import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PromocionCategoriaComponent} from "./promocion-categoria.component";

const routes: Routes = [
    {
        path: '', component: PromocionCategoriaComponent,
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PromocionCategoriaRoutingModule { }
