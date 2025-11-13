import { Injectable } from '@angular/core';
import { UsuarioService } from '../services/usuario.service'; // Asegúrate de que la ruta sea correcta

@Injectable({
  providedIn: 'root'
})
export class PermisoHelper {

  constructor(private usuarioService: UsuarioService) {}

  public readPermiso(): Promise<any> {
    let lstPermisos = ["ADM", "IMP", "EXP", "EXC", "EXCI", "EXF",'LISTI','LISTG','AGE','AGEF','AGER','CRUD','C','R','U','D','EXCFV'];
    
    const permisosPromises = lstPermisos.map((perm) => this.verificarPermiso(perm));
    
    return Promise.all(permisosPromises).then((resultados) => {
      
      const accesos = {
        accTot: resultados.some((x) => x.permiso === 'ADM' && x.acceso === true),
        accCma: resultados.some((x) => x.permiso === 'CMA' && x.acceso === true),
        accSup: resultados.some((x) => x.permiso === 'SUP' && x.acceso === true),
        accImp: resultados.some((x) => x.permiso === 'IMP' && x.acceso === true),
        accExp: resultados.some((x) => x.permiso === 'EXP' && x.acceso === true),
        accExc: resultados.some((x) => x.permiso === 'EXC' && x.acceso === true),        
        accExi: resultados.some((x) => x.permiso === 'EXCI' && x.acceso === true),
        accExf: resultados.some((x) => x.permiso === 'EXF' && x.acceso === true),
        accLstI: resultados.some((x) => x.permiso === 'LISTI' && x.acceso === true),
        accLstG: resultados.some((x) => x.permiso === 'LISTG' && x.acceso === true),
        accAge: resultados.some((x) => x.permiso === 'AGE' && x.acceso === true),
        accAgeF: resultados.some((x) => x.permiso === 'AGEF' && x.acceso === true),
        accAgeR: resultados.some((x) => x.permiso === 'AGER' && x.acceso === true),
        accCrud: resultados.some((x) => x.permiso === 'CRUD' && x.acceso === true),
        accCreate: resultados.some((x) => x.permiso === 'C' && x.acceso === true),
        accRead: resultados.some((x) => x.permiso === 'R' && x.acceso === true),
        accUpdate: resultados.some((x) => x.permiso === 'U' && x.acceso === true),
        accDelete: resultados.some((x) => x.permiso === 'D' && x.acceso === true),
        accFrmV: resultados.some((x) => x.permiso === 'EXCFV' && x.acceso === true),
      };
      return accesos; // Retorna los accesos en un objeto
    }).catch((error) => {
      console.log(error);
      return { 
           accTot: false
          ,accCma: false
          ,accSup: false
          ,accImp: false
          ,accExp: false
          ,accExi: false
          ,accExf: false
          ,accLstI: false
          ,accLstG: false
          ,accAge: false
          ,accAgeF: false
          ,accAgeR: false
          ,accCrud: false
          ,accCreate: false
          ,accRead: false
          ,accUpdate: false
          ,accDelete: false
          ,accExv: false
           }; // Retorna valores por defecto en caso de error
    });
  }

  private verificarPermiso(perm: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const param = {
        "IdUsuario": this.usuarioService.UsuarioActual.idUsuario,
        "Permisos": perm
      };

      this.usuarioService.valAccess(param).subscribe(
        (x) => {
          const { result } = x;
          resolve({
            "permiso": perm,
            "acceso": result[0].res === '1'
          });
        },
        (error) => {
          reject({
            "permiso": perm,
            "acceso": false
          });
        }
      );
    });
  }
}
