import {Injectable} from '@angular/core';
import { Usuario } from '../../../../shared/models/usuario';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  visible?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: Navigation[];
  
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

@Injectable()
export class NavigationItem {
  maestroRoles= [];
  maestroRolesmenu= [];
  NavigationItemst= [];
  idUsuario=0;
  idModulo=0;
  path=null;
  loadChildren=null;
  module=null;
  usuarioActual: Usuario;
  NavigationItems: any;

  constructor(
  ) {
  }
}
