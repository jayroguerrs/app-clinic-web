import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PlantillaDocumentoRegistroComponent} from "./plantilla-documento-registro.component";


const routes: Routes = [
    {
        path: '', component: PlantillaDocumentoRegistroComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PlantillaDocumentoRegistroRoutingModule { }
