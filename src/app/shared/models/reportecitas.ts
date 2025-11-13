export class reportecitas {
  public idUsuarioAtendio: number;
    constructor(
        // public idcita: number,
      public fechacita: string,
      public cantidad: number,
    ) {  }
}

export class TotalCitasEncuestadas{
  public totalCitas: number;
  public totalCitasPagadas: number;
  public totalSatisfaccion: number;
  public totalEfectividad: number;
}

export class especialistaCitas {
  public id: number;
  public nombre: string;
  public citas: reportecitas[] = [];
  constructor() {
  }
}

export class CitaEspecialista{
  public idCita: number;
  public idCliente: number;
  public cliente: string;
  public fecha: Date;
  public hora: string;
  public sede: string;
  public idProximaCitaAtendida: number | null;
  public proximaCitaAtendida: Date | null;

  public fechaProximaCita: Date | null;
  public idProximaCita: number | null;
  public colorProximaCita: string | null;
  public estadoProximaCita: string | null;
}

export class CronogramaCitasAtendidas{
  public sede: string;
  public fecha: Date;
  public h8: number;
  public h9: number;
  public h10: number;
  public h11: number;
  public h12: number;
  public h13: number;
  public h14: number;
  public h15: number;
  public h16: number;
  public h17: number;
  public h18: number;
  public h19: number;
  public h20: number;
  public h21: number;
  constructor() {
  }
}

export class ReporteAtendidasDiarias{
  public idCronograma: number;
  public idCita: number;
  public tipoCita: string;
  public fecha: string;
  public idServicio: number;
  public servicio: string;
  public idMaquinaMarca: number;
  public maquinaMarca: string;
  public numeroBox: number;
  public idCliente: number;
  public cliente: string;
  public sesion: number;
  public zonaClienteAntiguo: string;
  public zonaNuevaCliente: string;
  public zonaClienteNuevo: string;
  public precio: number;
  public promocion: string;
  public medioContactoOrigen: string;
  public usuarioAgendo: string;
  public atendidoPor: string;
  public sede: string;
  constructor() {
  }
}
