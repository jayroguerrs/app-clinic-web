export interface RHistoriaClinica{
  id: number;
  idCita: number;

  zonas: RHistoriaClinicaZona[];
  // fecha creacion
  fechaRegistro: Date | null;
  usuarioRegistro: string;
  fechaModifico: Date | null;
  usuarioModifico: string;


  idEstado: number;
}


export interface RHistoriaClinicaZona{
  id: number;
  idHistoriaClinica: number;
  idCitaDetalle: number;
  sesion: number;
  prototipoPiel: number;

  // Si la zona de la cita detalle tiene sub zonas
  dosis: RDosisSubZonas[];

  // equipo utilizado
  idEquipoLaser: number;
  equipoLaser: RH_EquipoLaser | null;

  // reacciones
  edema:number;
  eritema: number;
  dolor: number;
  agujas: number
  quemaduras: number;

  // comentarios
  comentario: string;
  comentarioCliente: string;
  comentarioSesion: string;

  // fotos
  foto1: string;
  foto2: string;

  // fecha creacion
  fechaRegistro: Date | null;
  usuarioRegistro: string;
  fechaModifico: Date | null;
  usuarioModifico: string;

  idEstado: number;
  hasEdit: boolean;

  zona: string | null;
}

export interface RH_EquipoLaser{
  id: string;
  nombre: string | null;
}

export interface RFotoHistoriaClinica{
  foto1: string | null;
  foto2: string | null;
}

export interface RDosisSubZonas{
  id: number;
  idZona: number;
  zona: string;
  valorJulios: string | null;
  valorContinuo: string | null;
  valorStackMovil: string | null;
  valorStackFijo: string | null;
}
