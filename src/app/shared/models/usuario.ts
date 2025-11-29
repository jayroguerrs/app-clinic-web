export class Usuario {
  usuario?: string;

  constructor(
    public idUsuario: number,
    public nombre: string,
    public login: string,
    public clave: string,
    public idperfil: number,
    public estado: number,
    public usuarioRegistro: string,
    public idSede: number,
    public foto: string
  ) {  }
    public genero: number;
    public menu: any;
    public perfil: string;
    public sede: string;
    public fechaRegistra: Date;
    public newMenu?: any;
    public datosActualizados?: boolean;
    public privilegio?: number;
    public aprobado?: number;
    public idSupervisor?: number;

    public claveGenerica?: boolean;
}


export class ShortUser{
  public id: number;
  public nombre: string;
  constructor() {
  }
}

export class UsuarioActualizarDatos {
    idUsuario: number;
    dni: string;
    nombres: string;
    celular: string;
    correo: string;
    fechaNacimiento: string; 
    nuevaClave: string;
    colorSidebarDeFondo?: string;
    colorSidebarDeTexto?: string;
    imagenFondo?: string;
    datosActualizados?: boolean

  constructor(
  ) {  }
}

export class PersonalizarClinic {
    idUsuario: number;
    colorSidebarDeFondo?: string | null;
    colorSidebarDeTexto?: string | null;
    imagenFondo?: string | null;

  constructor(
  ) {  }
}

export class ConfirmarUsuario{
  public idUsuario: number;
  public usuarioSupervisor: string;
  constructor() {
  }
}

export class AprobarUsuario{
  public idUsuario: number;
  public estadoAprobacion: number;
  constructor() {
  }
}