import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PerfilClienteComponent } from './cliente-perfil.component';

const routes: Routes = [
    {
        path: '', component: PerfilClienteComponent,
        children: [
          { path: '', redirectTo: 'General', pathMatch: 'full' },
          {path: 'Laser', loadChildren: () => import('../cliente-perfil-laser/cliente-perfil-laser.module').then(e => e.ClientePerfilLaserModule)},
          {path: 'Blanqueamiento', loadChildren: () => import('../cliente-perfil-aclaramiento/cliente-perfil-aclaramiento.module').then(e => e.ClientePerfilAclaramientoModule)},
          {path: 'Corporal360', loadChildren: () => import('../cliente-perfil-corporal360/cliente-perfil-corporal360.module').then(e => e.ClientePerfilCorporal360Module)},
          {path: 'General', loadChildren: () => import('../cliente-perfil-datosgenerales/cliente-perfil-datosgenerales.module').then(e => e.ClientePerfilDatosgeneralesModule)},
          {path: 'Ajustes', loadChildren: () => import('../cliente-perfil-ajustes/cliente-perfil-ajustes.module').then(e => e.ClientePerfilAjustesModule)},
          {path: 'RejuvenecimientoFacial', loadChildren: () => import('../cliente-perfil-rejuvenecimiento-facial/cliente-perfil-rejuvenecimiento-facial.module').then(e => e.ClientePerfilRejuvenecimientoFacialModule)},
          {path: 'tratamiento-facial', loadChildren: () => import('../cliente-perfil-tratamiento-facial/cliente-perfil-tratamiento-facial.module').then(e => e.ClientePerfilTratamientoFacialModule)},
          {path: 'Exfoliacion', loadChildren: () => import('../cliente-perfil-exfoliacion/cliente-perfil-exfoliacion.module').then(e => e.ClientePerfilExfoliacionModule)},
          {path: 'Dermatologia', loadChildren: () => import('../cliente-perfil-dermatologia/cliente-perfil-dermatologia.module').then(e => e.ClientePerfilDermatologiaModule)}
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClientePerfilRoutingModule { }
