import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ReportecitaencuestaComponent} from "./reportecitaencuesta.component";

const routes: Routes = [
    {
        path: '',
        component: ReportecitaencuestaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportecitaencuestaRoutingModule { }
