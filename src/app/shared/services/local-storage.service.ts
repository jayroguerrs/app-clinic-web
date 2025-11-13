import { Injectable } from '@angular/core';
import { User } from "../interfaces/usuario";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  user: User | null;

  constructor() { }

  /**
   * Obtiene el usuario actual desde localStorage
   */
  getUser(): User | null {
    try {
      const userlocal: any = JSON.parse(localStorage.getItem('usersKey'));
      if (!userlocal) return null;
      
      this.user = {
        id: userlocal.idUsuario,
        name: userlocal.idUsuario,
        username: userlocal.idUsuario,
        rol: {
          id: userlocal.idPerfil,
          name: userlocal.perfil
        },
        photo: userlocal.foto,
        menu: userlocal.menu,
        sede: {
          id: userlocal.idSede,
          name: userlocal.sede
        },
        fechaRegistra: new Date(userlocal.fechaRegistra)
      }
      return this.user;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  }

  /**
   * Obtiene el rol del usuario actual
   */
  getRolUser(): number | null {
    this.getUser();
    if (this.user) {
      return this.user.rol.id;
    }
    return null;
  }

  /**
   * Valida si el usuario tiene un rol permitido
   */
  validateRol(): boolean | null {
    this.getUser();
    if (this.user) {
      if (this.user.rol.id == 1 || this.user.rol.id == 4 || this.user.rol.id == 6 || this.user.rol.id == 7) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  /**
   * Guarda un valor en localStorage
   */
  set(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error guardando en localStorage (${key}):`, error);
    }
  }

  /**
   * Obtiene un valor de localStorage
   */
  get(key: string): any {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error obteniendo de localStorage (${key}):`, error);
      return null;
    }
  }

  /**
   * Elimina un valor de localStorage
   */
  remove(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Actualiza un objeto existente en localStorage
   */
  update(key: string, newValues: any): any {
    try {
      const currentValue = this.get(key);
      if (!currentValue) return null;
      
      const updatedValue = { ...currentValue, ...newValues };
      this.set(key, updatedValue);
      return updatedValue;
    } catch (error) {
      console.error(`Error actualizando localStorage (${key}):`, error);
      return null;
    }
  }

  /**
   * Verifica si existe una clave en localStorage
   */
  has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  /**
   * Limpia todo el localStorage
   */
  clear(): void {
    localStorage.clear();
  }

  /**
   * Actualiza los datos del usuario
   */
  updateUserData(newData: Partial<any>): boolean {
    try {
      const userData = this.get('usersKey');
      if (!userData) return false;
      
      const updatedUser = { ...userData, ...newData };
      this.set('usersKey', updatedUser);
      return true;
    } catch (error) {
      console.error('Error actualizando datos de usuario:', error);
      return false;
    }
  }

  /**
   * Actualiza las preferencias visuales del usuario
   */
  updateUserPreferences(colorFondo: string, colorTexto: string, imagenFondo?: string): boolean {
    return this.updateUserData({
      colorSidebarDeFondo: colorFondo,
      colorSidebarDeTexto: colorTexto,
      ...(imagenFondo && { imagenDeFondo: imagenFondo })
    });
  }
}