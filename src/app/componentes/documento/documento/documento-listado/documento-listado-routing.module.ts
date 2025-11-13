import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentoListadoComponent } from './documento-listado.component';
const routes: Routes = [
    {
        path: '', component: DocumentoListadoComponent,
        children: [ { path: '', component: DocumentoListadoComponent  }  ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DocumentoListadoRoutingModule { }