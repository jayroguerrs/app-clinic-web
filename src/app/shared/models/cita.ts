import { AccionCita } from '../enumeracion/enums';
import { ClienteImportClass } from './cliente';
import {MedioContacto} from "../../componentes/preferente/preferente.models";
import {ZonaTratamiento} from "./zonas";

export class CitaImportClass {
  public idCita: number = 0;
  public cliente: any = new ClienteImportClass();
  public zonasCorporales: ZonaCorporalClass[] = null;
  public detalles : any;
  public tiempoEnReserva: any;
  public fecha: Date = null;
  public horaInicio: Date;
  public horaTermino: Date;
  public idMaquina: number = 0;
  public duracion: number = 0;
  public idSede: number = 0;
  public sede: string = '';
  public idTipoCita: number = 0;
  public idTipoCliente: number = 0;
  public citaMensajeAvisos  = [];
  public citaMensajeNotas  = [];
  public citaMensajeDetalles  = [];
  public accionCita: AccionCita;
  public horarioPorReprogramacion: boolean = false;
  public modificado: boolean = false;
  public esEditadoSigCita: boolean = false;
  public idUsuario: number;
  public idUsuarioAtendidoPor?: number;
  public usuarioAtendidoPor: string;
  public idEstado: number;

  public maestroSedes: any;
  public maestroZonasCorporales: any;
  public maestroMaquinaSedes: any;

  public fechaRegistra: Date;
  public usuarioRegistra: string;

  public colorEstado: string = '';
  public maquina : CitaMaquina = new CitaMaquina(0,'');

  public idMedioContacto: number = 0;
  public otroMedioContacto: string | null;

  public idDescuento: number = 0;
  public descuentoAplicaA: string | null = null;
  public cuponDescuento: string | null = null;

  public idUsuarioAsignado: number = 0;
  public fechaConfirmacion: Date | null = null;
  public idCitaAsignacion: number = 0;

  public idServicio: number = 0;
  public idPreferente: number = 0;

  public numeroBox: number = 0;
  public idMaquinaMarca: number = 0;
  public esNotificado: boolean = false;

  public precioDePagoFinal?: number;

  public servicio: string | null = null;
  public tipoDePago: number | null = null;

  constructor(
  ) {  }
}

export class CitaMaquina{
  constructor(
    public id: number,
    public descripcion: string
  ) {  }
}

export class cita{
  constructor(
    public IdCita: number,
    public IdCliente: number,
    public IdSede: number,
    public Sede: string,
    public Nombres: string,
    public Apellidos: string,
    public Documento: string,
    public FechaCita: string,
    public Celular1: string,
    public Celular2: string,
    public HoraInicio: string,
    public HoraTermino: string,
    public Duracion: string,
    public Total: string,
    public Zonas: string,
    public TipoCita: string,
    ) {  }

}
export class ZonaCorporalClass {
  public tratamientos: ZonaTratamiento[] = [];
  public loading: boolean;
  public estado: boolean;
  public duplicado?: boolean;
  public verDuplicado?: boolean;
  public parametros?: string;
  public sesionFinal?: number;
  public tratamientoRealizado?: boolean;

  constructor(
    public id: number = 0,
    public idZona: number,
    public idUsuarioAgendado: number,
    public usuarioAgendado: string,
    public idUsuarioAgendadoStr: string,
    public idPromocionPrecio: number,
    public promocion: number,
    public descripcion: string,
    public duracion: number,
    public promociones: PromocionPorZonaCorporal[],
    public sesion: number = 1,
    public precio: number,
    public retroTratam: boolean = false,
    public pagoWeb: boolean = false,
    public precioDescuento: number = 0,
    public idMedioContactoOrigen: number = 0,
    public modificado ?: boolean
  ) {
    this.loading = false;

  }
}
export class PromocionPorZonaCorporal  {
  constructor(
    public idPromocionPrecio: number,
    public idPromocion: number,
    public descripcion: string,
    public idZonaCorporal: number,
    public precioBase: number,
    public precioPromocion: number
  ) {  }
}

export class CitaClass{
  public idCronograma: number = 0;
  public id: number = 0;
    public numeroCita: string;
    public cliente: {
      id: number;
      foto: string;
      codigo: string;
    }
    public colorEstado: string;
    public hora: string;
    public horaInicio: string;
    public horaTermino: string;
    public duracion: number;
    public pagado: boolean;
    public textoPagado: string;
    public resumen: string;

    public sede: {
      id: number,
      nombre: string;
    } = null;
    public numeroSesion: number;

    public tipoCita: {
      id: number;
      nombre: string;
      nombreCorto: string;
    }

    public fechaCita: Date;
    public fechaRegistra: Date;

    public estado: {
      id: number;
      nombre: string;
    };

    public idPreferente: number = 0;


    idServicio: number;
    servicio: string | null;
    servicioColor: string | null;

    constructor() {
    }
}


export class CitaDetalle{
  public id: number;
  public idCita: number;
  public zona: CT_Zona;
  public sesion: number;
  public precio: number;
  public pagoWeb: boolean;


  public selectComprobante: boolean;
  public pagado: boolean;

  constructor() {
    this.selectComprobante = true;
    this.pagado = false;
  }
}

export class CT_Zona{
  public id: number;
  public nombre: string;
  constructor() {
  }
}


export class CitaTipo{
  public id: number;
  public nombre: string;
  constructor() {
  }
}

export class Cita{
  public id: number;
  public idSede: number;
  public sede: string;
  public numCitas: number;
  public fechaCita: Date;
  public estado: string;
  public colorEstado: string;
}


export class CitaExportar{
  public idCita: number;
  public sede: string;
  public cliente: string;
  public fechaCita: string;
  public zonas: string;
  public promociones: string;
  public horaInicio: string;
  public estado: string;
  public pagado: string;
  public total: number;
  constructor() {
  }
}



export class CitaPromocion{
  public idCita: number;
  public idSede: number;
  public sede: string;
  public numeroCita: number;
  public cliente: number;
  public fechaCita: Date;
  public horaCita: string;
  public zona: string;
  public idZona: number;
  public sesion: number;
  public idPromocion: number;
  public promocion: string;
  public promoFechaIni: Date;
  public promoFechaFin: Date;
  public precioZona: number;
  public totalCita: number;
  public estado: string;
  constructor() {
  }
}

export class CitaReporte{
  public idCita: number;
  public idCliente: number;
  public fecha: Date;
  public idEstado: number;
  public estado: string;
  public estadoColor: string;
  public cliente: string;
  public documentoIdentidad: string;
  public telefono: string;
  public tipoCliente: string;
  public idServicio: number;
  public servicio: string;
  public idTipoCita: number;
  public tipoCita: string;
  public servicioColor: string;
  public idSede: number;
  public sede: string;
  public zonas: string;
  public genero: string;
  public alias: string;
  public total: number;
  public fechaRegistro: Date;
  public distrito: string;
  public atendidoPor: string;
  public utmTerm: string;
  public utmSource: string;
  public utmCampaign: string;
  public utmCont: string;
  public medioContacto: string;
  public utmMedium: string;
  public motivo: string;
  public usuarioSeguimiento?: string;
  constructor() {
  }
}


export class CitaReporteDetallado{
  public idCita: number;
  public idCliente: number;
  public fecha: Date;
  public idEstado: number;
  public estado: string;
  public estadoColor: string;
  public cliente: string;
  public documentoIdentidad: string;
  public telefono: string;
  public tipoCliente: string;
  public idServicio: number;
  public servicio: string;
  public idTipoCita: number;
  public tipoCita: string;
  public servicioColor: string;
  public idSede: number;
  public sede: string;
  public zona: string;
  public sesion: number;
  public precio: number;
  public promocion: string;
  public origen: string;
  public agendadoPor: string;
  public usuarioRegistro: string;
  public genero: string;
  public alias: string;
  public total: number;
  constructor() {
  }
}

export class CitaReporteDetalladoAgendado{
  public idCita: number;
  public idCliente: number;
  public nombreCliente: string;
  public apellidoCliente: string;
  public documentoCliente: string;
  public telefonoCliente: string;
  public zona: string;
  public sesion: number;
  public promocion: string;
  public precio: number;
  public idEstado: number;
  public estado: string;
  public estadoColor: string;
  public idTipoCliente: number;
  public tipoCliente: string;
  public idSede: number;
  public sede: string;
  public fechaCita: Date;
  public idServicio: number;
  public servicio: string;
  public servicioColor: string;
  public idUsuarioAgendo: number;
  public usuarioAgendo: string;
  public idUsuarioRegistro: number;
  public usuarioRegistro: string;
  public fechaRegistro: Date;

  constructor() {
  }

}


export class CitaHistoriaMasiva{
  public registros: HistoriaCita[];
  public numeroRegistros: number;
  public nombreArchivo: string;
  public idUsuarioRegistro: number;
}

export class HistoriaCita{
  public idCita: number;
  public historiaNota: string | null;
  public historiaAviso: string | null;
  public historiaDetalle: string | null;
}

export class ParametroUpdate{
  public idCitaDetalle: number;
  public parametro: string | null;
}



export class CitaSinSiguienteCita{
  public idCita: number;
  public idCliente: number;
  public cliente: string;
  public telefonoCliente: string;
  public sede: string;
  public colorServicio: string;
  public servicio: string;
  public fechaCita: Date;
  public estadoCita: string;
  public colorEstadoCita: string;
  public pagado: boolean;

  // secondary
  public realizado: string | null = null;
  public title: string | null = null;
  constructor() {
    this.realizado = null;
  }
}


export class CitaDatos{
  public idCita : number;
  public fechaCita : Date;
  public idSede : number;
  public sede : string;
  public idServicio : number;
  public servicio : string;
  public servicioColor : string;
  public duracion : number;
  public horaInicio : Date;
  public horaTermino : Date;
  public minutoInicio : number;
  public minutoTermino : number;
  public idEstado : number;
  public estado : string;
  public estadoColor : string;


  public idMaquina: number;

  constructor() {
    this.idMaquina = 0;
  }
}



export class CitaCliente{
  id: number;
  idCronograma: number;
  cliente: string;
  idCliente: number;
  fecha: Date;
  telefono: string;
  servicio: string;
  servicioColor: string;
  idServicio: number;
  sede: string;
  idSede: number;
  estado: string;
  estadoColor: string;
  idEstado: number;

  // secondary
  idEstadoInicial: number;
  detalle: string;

  constructor() {
    this.detalle = null;
  }
}
