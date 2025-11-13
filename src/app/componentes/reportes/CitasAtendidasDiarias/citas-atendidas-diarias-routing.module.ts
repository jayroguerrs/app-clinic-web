import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CitasAtendidasDiariasComponent} from "./citas-atendidas-diarias.component";

const routes: Routes = [
    {
        path: '',
        component: CitasAtendidasDiariasComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CitasAtendidasDiariasRoutingModule { }
