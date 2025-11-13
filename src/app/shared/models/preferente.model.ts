export class Preferente {
     public id: number;
     public nombres: string;
     public apellidos: string;
     public email: string;
     public idMedioContacto: number;
     public otroMedioContacto: string;
     public promocion: string;
     public idUbicacion: string;
     public direccion: string;
     public idTeleoperador: number;
     public idComentario: number;
     public fechaAsignacion: Date;
     public usuarioRegistra: string;
     public fechaRegistra: Date;
     public usuarioEdita: string;
     public fechaEdita: Date;
     public observacion: string;
     public telefono: string;
}


export class PreferenteHistorial{
    public id: number;
    public idPreferente: number;
    public idEstado: number;
    public idEstadoAtencion: number;
    public idUsuarioRegistro: number;
    public idTeleoperador: number;
    public fechaRegistro: Date;
    public observacion: string[] = [];
    public datosModificados: string;

    //

    public estado: string;
    public estadoAtencion: string;
    public comentarioAtencion: string;
    public usuarioRegistro: string;
    public teleoperador: string;

    constructor() {
    }

}

export class PreferenteAsignarLista{
  public idPreferente: number;
  public idUsuarioOperador: number;
  public idUsuarioRegistra: number;
  constructor() {
  }
}

export class PreferenteReporteMedioContacto{

  public fecha: Date;
  public totalPreferentes: number;
  public totalAsignados: number;
  public totalAgendados: number;
  public totalEfectivos: number;
  public totalEfectivosNuevos: number;
  public totalEfectivosAntiguos: number;
  public idMedioContacto: number | null;
  public medioContacto: string | null;

  constructor() {
  }
}

export class PreferenteReporteTotal{

  public totalPreferentes: number;
  public totalAsignados: number;
  public totalAgendados: number;
  public totalEfectivos: number;
  public totalEfectivosNuevos: number;
  public totalEfectivosAntiguos: number;

  constructor() {
  }
}


export class PreferenteAtencionCategoria{

  id: number;
  nombre: string;
  idEstado: number;
  constructor() {
  }

}

export class PreferenteAtencionOpcion {

  id: number;
  idCategoria: number;
  nombre: string;
  idEstado: number;

  constructor() {
  }

}


export class PreferenteHistoria{
  id: number;
  idPreferente: number;
  asignadoA: string;
  asignadoPor: string;
  fechaRegistro: Date;

  constructor() {
  }
}


export class PreferenteObservacion{
    id: number;
    idPreferente: number;
    observacion: string;
    fechaRegistro: Date;
    idUsuarioRegistro: number;
    usuarioRegistro: string;
    inicialesUsuario: string;


    canDelete: boolean;

    constructor() {
      this.canDelete = true;
    }
}
