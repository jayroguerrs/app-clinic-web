import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReporteCitasComponent  } from './reportecitas.component';

const routes: Routes = [
    {
        path: '', component: ReporteCitasComponent,
        children: [
             { path: '', component: ReporteCitasComponent  },
       /*       { path: 'registro/editar/:id', component: RegistrocajaComponent }   */      ] 
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportecitasRoutingModule { }