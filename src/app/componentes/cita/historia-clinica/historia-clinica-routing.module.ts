import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HistoriaClinicaComponent } from './historia-clinica.component';

const routes: Routes = [
    {
        path: '', component: HistoriaClinicaComponent,
        children: [
            { path: '', component: HistoriaClinicaComponent  },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HistoriaClinicaRoutingModule { }