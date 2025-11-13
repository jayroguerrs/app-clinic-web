import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuListadoComponent } from './menu-listado.component';

const routes: Routes = [
    {
        path: '', component: MenuListadoComponent,
        children: [
            { path: '', component: MenuListadoComponent  },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MenuListadoRoutingModule { }