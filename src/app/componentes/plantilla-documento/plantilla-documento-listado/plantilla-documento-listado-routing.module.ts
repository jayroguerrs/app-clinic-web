import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PlantillaDocumentoListadoComponent} from "./plantilla-documento-listado.component";


const routes: Routes = [
    {
        path: '', component: PlantillaDocumentoListadoComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PlantillaDocumentoListadoRoutingModule { }
