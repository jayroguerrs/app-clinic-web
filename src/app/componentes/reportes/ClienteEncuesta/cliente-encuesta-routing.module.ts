import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClienteEncuestaComponent } from './cliente-encuesta.component';

const routes: Routes = [
    {
        path: '',
        component: ClienteEncuestaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClienteEncuestaRoutingModule { }
