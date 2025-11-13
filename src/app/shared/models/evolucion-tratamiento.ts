export class EvolucionTratamiento{
  public id: number = 0;
  public idCita: number = 0;

  public zonas: EvolucionTratamientoZona[] = [];

  // fecha creacion
  public fechaRegistro: Date;
  public usuarioRegistro: string;
  public fechaModifico: Date = null;
  public usuarioModifico: string | null;
  public usuarioAtendio: string;

  public idEstado: number = 0;
  public idUsuarioRegistro: number;

  // alter
  public idUsuarioModifico: number | null;
  public idUsuarioAtendio: number;

  constructor() {
  }
}

export class EvolucionTratamientoZona{
  public id: number = 0;
  public idEvolucionTratamiento: number = 0;
  public idCitaDetalle: number;
  public sesion: number;
  public fototipoPiel: number;

  // Si la zona de la cita detalle tiene sub zonas
  public dosis: EvolucionTratamientoDosis[] = [];

  // equipo utilizado
  public equipoLaser: ET_EquipoLaser = null;
  public idEquipoLaser: number | null;


  // reacciones
  public edema:number;
  public eritema: number;
  public dolor: number;
  public agujas: number
  public quemaduras: number;

  // comentarios
  public comentario: string;
  public comentarioCliente: string;
  public comentarioSesion: string;

  // fotos
  public foto1: string = null;
  public foto2: string = null;

  // fecha creacion
  public fechaRegistro: Date = null;
  public usuarioRegistro: string;
  public fechaModifico: Date = null;
  public usuarioModifico: string;

  // alter
  public idUsuarioRegistro: number;
  public idUsuarioModifico: number;

  public idEstado: number = 0;
  public hasEdit: boolean = false;

  public zona: any = null;

  constructor() {
  }
}

export class ET_EquipoLaser{
  id: number;
  nombre: string;
}

export class ET_FotoZona{
  foto1: string | null;
  foto2: string | null;
}

export class EvolucionTratamientoDosis{
  id: number;
  idZona: number;
  zona: string;
  valorJulios: string | null = null;
  valorContinuo: string | null = null;
  valorStackMovil: string | null = null;
  valorStackFijo: string | null = null;
  constructor() {
  }
}
