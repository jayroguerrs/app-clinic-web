import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {
  private perfilesAutorizados = [4, 7, 9, 16, 6, 8, 12];
  //? These users aren't asked for authorization
  private privilegiosAutorizados = [3, 6, 9];


  isAutorizado(idPerfil: number): boolean {
    return this.perfilesAutorizados.includes(idPerfil);
  }

  tienePrivilegio(idPrivilegio: number): boolean {
    return this.privilegiosAutorizados.includes(idPrivilegio);
  }
}
