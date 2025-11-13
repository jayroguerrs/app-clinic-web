import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EspecialistasComponent } from './especialistas.component';

const routes: Routes = [
    {
        path: '', component: EspecialistasComponent,
        children: [
             { path: '', component: EspecialistasComponent  },
       /*       { path: 'registro/editar/:id', component: RegistrocajaComponent }   */      ] 
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EspecialistasRoutingModule { }