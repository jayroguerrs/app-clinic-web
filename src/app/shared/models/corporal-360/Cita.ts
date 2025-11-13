import {PromocionZona} from "../promocion";

export class Cita{
  idCronograma: number;
  idCita: number;
  idCliente: number;
  idUsuario: number;
  idTipoCliente: number;
  idSede: number;
  idMaquina: number;
  // idTecnologia: number;
  idEstado: number;
  idUsuarioAtendidoPor: number;
  fechaCita: Date;
  idTipoCita: number;
  horaInicio: string;
  horaTermino: string;
  total: number;
  pagado: number;
  usuarioRegistra: string;
  usuarioEdita: string;

  idTipoComprobante: number;
  idTipoPago: number;
  numeroComprobante: number;
  siguienteCita: number;
  citaAnterior: number;
  idEstadoPendiente: number;
  idMedioContacto: number;
  otroMedioContacto: number;
  idDescuento: number;
  descuentoAplicaA: number;
  cuponDescuento: string;
  idServicio: number;

  detalles: CitaDetalle[] = [];
  mensajeAvisos : CitaMensajeAviso[] = [];
  mensajeDetalles : CitaMensajeDetalle[] = [];
  mensajeNotas : CitaMensajeNota[] = [];
  numeroBox: number = 0;
  idMaquinaMarca: number | null;

  // secondary
  atendidoPor: string | null;
  minutos: number;
  hora: number;
  maquina: string;
  servicio: string;
  servicioNombreCorto: string;
  sede: string | null;
  servicioColor: string;
  tipoCita: string;
  // tecnologia: string;
  // tecnologiaNombreCorto: string;

  idPreferente: number;


  constructor() {
    this.idCita = 0;
    this.idCronograma = 0;
    this.detalles = [];
    this.hora = 0;
    this.idPreferente = 0;
  }
}

export class CronogramaSemana{
  inicio: Date;
  fin: Date;
}

export class CitaDetalle{
  id: number;
  idCita: number;
  idTecnologia: number;
  idZona: number;
  idPromocion: number;
  idPromocionPrecio: number;
  sesion: number;
  precio: number;
  minutos: number;
  idUsuarioAgendado: number;

  // secondary
  tecnologia: string | null;
  tecnologiaNombreCorto: string;
  servicio: string | null;
  zona: string;
  promocion: string | null;
  usuarioAgendado: string | null;
  promocionZona: PromocionZona[] = [];
  loadingPromocionZona: boolean;
  collapsed = false;
  edited = false;
  idMedioContactoOrigen: number;

  constructor() {
    this.id = 0;
    this.sesion = 1;
    this.idCita = 0;
    this.idTecnologia = 0;
    this.precio = 0.0;
    this.minutos = 10;
    this.idPromocion = 0;
    this.idUsuarioAgendado = 0;
    this.servicio = null;
    this.usuarioAgendado = null;
    this.loadingPromocionZona = false;
    this.idMedioContactoOrigen = 0;
  }
}



export class CitaMensajeAviso{
  id: number;
  texto: string;
  fechaRegistro: Date;
  idUsuarioRegistro: number;
  idCita: number;
  destacado: boolean = false;

  // secondary
  usuarioRegistro: string;
  borrar: boolean = false;
  constructor() {
  }
}
export class CitaMensajeDetalle{
  id: number;
  texto: string;
  fechaRegistro: Date;
  idUsuarioRegistro: number;
  idCita: number;
  destacado: boolean = false;

  // secondary
  usuarioRegistro: string;
  borrar: boolean = false;
  constructor() {
  }
}
export class CitaMensajeNota{
  id: number;
  texto: string;
  fechaRegistro: Date;
  idUsuarioRegistro: number;
  idCita: number;
  idCliente: number;
  destacado: boolean = false;

  // secondary
  usuarioRegistro: string;
  borrar: boolean = false;
  constructor() {
  }
}

export class CronogramaCita{
  id: number;
  // uuid: string;
  idCliente: number;
  idSede: number;
  idTipoCliente: number;
  idServicio: number;
  idTratamiento: number;
  idZona: number;
  // semanas: CronogramaCitaSemana[];
  idUsuarioRegistro: number;
  fechaRegistro: Date;
  idUsuarioModifico: number | null;
  fechaModifico: Date | null;
  precio: number = 0;


  //secondary
  usuarioRegistro: string;
  usuarioModifico: string | null;
  servicio: string | null;
  tratamiento: string | null;
  servicioNombreCorto: string | null;
  servicioColor: string;
  sede: string;
  zona: string;
  numeroCitas: number;
  idPreferente: number

  constructor() {
    this.idPreferente = 0;
    // this.semanas = [];
  }
}

// export class CronogramaCitaSemana{
//   inicio: Date;
//   fin: Date;
// }

export class CitaSeguimiento{
  id: number;
  idCita: number;
  idCitaSeguimientoConcepto: number;
  descripcion: string;
  idUsuarioRegistro: number;
  fechaRegistro: Date;
  valorAnterior: string | null;
  valorActual: string | null;

  // secondary
  fechaCita: Date;
  usuarioRegistro: string;
  detalle: string;

  constructor() {
  }
}

export class CronogramaSeguimiento{
  id: number;
  idCronograma: number;
  idCronogramaSeguimientoConcepto: number;
  descripcion: string;
  idUsuarioRegistro: number;
  fechaRegistro: Date;
  valorAnterior: string | null;
  valorActual: string | null;

  // secondary
  usuarioRegistro: string;
  detalle: string;

  constructor() {
  }
}

export class CronogramaCita_Cita{
  id: number;
  fecha: Date;
  idEstado: number;
  idTipoCita: number;
  estado: string;
  estadoColor: string;
  detalles: CitaDetalle[];
  idPreferente: number;

  constructor() {
  }
}
