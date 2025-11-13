import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TicketListadoComponent } from './ticket-listado/ticket-listado.component';

const routes: Routes = [
    {
        path: '', component: TicketListadoComponent,
        children: [
             { path: '', component: TicketListadoComponent  },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TicketRoutingModule { }