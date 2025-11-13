import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CitasAtendidasComponent} from "./citas-atendidas.component";

const routes: Routes = [
    {
        path: '',
        component: CitasAtendidasComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CitasAtendidasRoutingModule { }
