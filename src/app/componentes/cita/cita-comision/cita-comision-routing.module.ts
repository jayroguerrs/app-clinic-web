import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CitaComisionComponent } from './cita-comision.component';

const routes: Routes = [
    {
        path: '', component: CitaComisionComponent,
        children: [ { path: '', component: CitaComisionComponent  }  ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CitaComisionRoutingModule { }