import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TblCronogramaCitasAtendidasComponent} from "./tbl-cronograma-citas-atendidas.component";

const routes: Routes = [
    {
        path: '',
        component: TblCronogramaCitasAtendidasComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TblCronogramaCitasAtendidasRoutingModule { }
