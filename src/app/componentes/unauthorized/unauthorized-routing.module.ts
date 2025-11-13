import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccessComponent } from './access/access.component';
import { ActualizarDatosComponent } from './actualizar-datos/actualizar-datos.component';
import { QaAccessComponent } from './qa-access/qa-access.component';
import { UserVerificationComponent } from './user-verification/user-verification.component';
import { paths } from '../../../commons/routes';

const path = paths.unauthorized;

export const routesUnauthorized: Routes = [
  { path: '', component: AccessComponent },
  { path: path.updateData, component: ActualizarDatosComponent },
  { path: path.environmentAccess, component: QaAccessComponent },
  { path: path.userVerification, component: UserVerificationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routesUnauthorized)],
  exports: [RouterModule]
})
export class UnauthorizedRoutingModule { }
