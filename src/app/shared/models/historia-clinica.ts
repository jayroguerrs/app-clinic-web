export class HistoriaClinica{
  public id: number = 0;
  public idCita: number = 0;

  public zonas: HistoriaClinicaZona[] = [];

  // fecha creacion
  public fechaRegistro: Date = null;
  public usuarioRegistro: string;
  public fechaModifico: Date = null;
  public usuarioModifico: string;

  public idEstado: number = 0;

  // alter
  public idUsuarioRegistro: number;

  constructor() {
  }
}

export class HistoriaClinicaZona{
  public id: number = 0;
  public idHistoriaClinica: number = 0;
  public idCitaDetalle: number;
  public sesion: number;
  public prototipoPiel: number;

  // Si la zona de la cita detalle tiene sub zonas
  public dosis: DosisSubZonas[] = [];

  // equipo utilizado
  public equipoLaser: EquipoLaser = null;


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

  public idEstado: number = 0;
  public hasEdit: boolean = false;

  public zona: any = null;

  constructor() {
  }
}

export class EquipoLaser{
  id: number;
  nombre: string;
}


export class DosisSubZonas{
  id: number;
  idZona: number;
  zona: string;
  valorJulios: string = null;
  valorContinuo: string = null;
  valorStackMovil: string = null;
  valorStackFijo: string = null;
  constructor() {
  }
}

export class HistoriaClinicaCliente{
  id: number;
  idFichaAdmision: number | null;
  fechaHistoria: Date | null;
  idCliente: number | null;
  fecha: string | null;
  nombreCompleto: string | null;
  telefono: string | null;
  domicilio: string | null;
  edad: number | null;
  fechaNacimiento: Date | null;
  estadoCivil: string | null;
  fototipoPiel: string | null;
  tipoDocumento: string | null;
  documento: string | null;
  profesion: string | null;
  email: string | null;


  alergMedicamentos: string | null;
  antecMedico: string | null;
  antecQuirurgico: string | null;
  antecTrataFarmaco: string | null;
  antecTrataEstetic: string | null;

  patologias: HC_Patologia[] = [];

  peso: number | null;
  altura: number | null;
  numeroHijos: number | null;

  tipoCicatrizacion: number | null;
  bebeAlcohol: number | null;
  esFumador: number | null;

  tieneMedicacion: number | null;
  tieneMedicacionV: string | null;
  indiqueMedicacion: number | null;
  indiqueMedicacionV: string | null;

  comunicacionCliente: number | null;

  observaciones: string | null;

  ultimos12meses : string;
  antecedenteFamiliar : string;
  reaccionAlergicaCutanea : string;
  embarazoSospecha : number | null;
  cigarrosAldia: number;
  idMedioContacto: number;

  genero: string | null;
  idUsuarioRegistro: number | null;
  usuarioRegistro: string | null;
  fechaRegistro: Date| null;
  idUsuarioModifico: number | null;
  usuarioModifico: string | null;
  fechaModifico: Date| null;

  idEstado: number;

  zonasConsultar: HC_Zonas[];
  zonasRealizar: HC_Zonas[];

  constructor() {
  }
}


export class HC_Patologia{
  nombre: string;
  activo: boolean;
  constructor() {
  }
}

export class HC_Zonas{
  id: number;
  nombre: string;
  constructor() {
  }
}
