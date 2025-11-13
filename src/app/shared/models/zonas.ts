export class zonas {

    constructor(
      public idZona: number,
      public descripcion: string,
      public duracion: number,
      public sexo: string,
      public igv: number,
      public activo: number
          ) {  }
}

export class SubZona{
    constructor(
      public id: number,
      public zona: string,
    ) {
    }
}


export class Zona {
  public id: number;
  public nombre: string;
  public descripcion: string;
  public descripcionLarga: string;
  public cantidad: number;
  public duracion: number;
  public minutos: number;
  public sexo: string;
  public igv: number;
  public activo: number;
  public idTipo: number;
  public fechaRegistro: Date;
  public idGenero: number;
  public idEstado: number;
  public idServicio: number;
  public idTecnologia: number;
  public imagen: string;
  public precioBase: number;
  public precioDescuento: number;
  public sesion: number = 1;


  // secondary
  public genero: string;
  public servicio: string;
  public servicioColor: string;

  constructor() {
  }
}

export class ZonaTratamiento{
  public id: number;
  public idServicio: number;
  public nombre: string;
  public descripcion: string;
  public idEstado: number;
  public idUsuarioRegistro: number;
  public idUsuarioModifico: number
  public fechaRegistro: Date;
  public fechaModifico: Date | null;

  //secondary
  public usuarioRegistro: string;
  public usuarioModifico: string | null;
  public servicio: string;
  public servicioColor: string;
  public estado: boolean;

  constructor() {
  }
}

export class ZonaSesionTratamiento{
  public id: number;
  public idZona: number;
  public sesion: number;
  public tratamientos: ZonaTratamiento[] = [];
  public idTratamientos: number[] = [];
  public idUsuarioRegistro: number;
  public fechaRegistro: Date | undefined;

  //secondary
  public usuarioRegistro: string | undefined;

  constructor() {
  }
}

