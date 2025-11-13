import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TipoDocumentoListadoComponent} from "./tipo-documento-listado.component";


const routes: Routes = [
    {
        path: '', component: TipoDocumentoListadoComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TipoDocumentoListadoRoutingModule { }
