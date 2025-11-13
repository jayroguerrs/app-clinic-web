export class DocumentoTipo {
  public id: number;
  public nombre: string = '';
  public titulo: string = '';
  public perfiles: DocumentoTipoPerfil[] = [];
  public version: number;

  public idServicio: number;
  public idUsuarioRegistro: number;
  public fechaRegistro: Date | null;
  public idUsuarioModifico: number;
  public fechaModifico: Date | null;


  // controllers
  public blPromocion: boolean;
  public blZona: boolean;
  public blPatologia: boolean;
  public blApoderado: boolean;
  public blMantenimiento: boolean;
  public blRetroceso: boolean;

  // secondary
  public servicio: string;
  public servicioColor: string;
  public usuarioRegistro: string;
  public usuarioModifico: string;

  public docStatus: number;

  constructor(
  ) {  }
}


export class DocumentoTipoPerfil {
  public id: number;
  public nombre: string;

  constructor(
  ) {  }
}


export class DocumentoPlantilla{
  public id: number;
  public plantilla: string;
  public version: number;
  public estado: boolean;
  public fechaRegistra: Date;
  public usuarioRegistra: string;
  public documento: DocumentoTipo | null = null;
  public header: string;
  public footer: string;
  public html: string;
  public margin: number[] = [];

  constructor() {
  }
}


export class Documento{
  public id: number = 0;
  public idCliente: number= null;
  public idDocumentoTipo: number= null;
  public idPromocion: number= null;
  public idZonas: string = '';
  public idPatologia: number= null;
  public sesionesAdicionales: number = 0;
  public intervaloMantenimiento: number = 0;
  public consultaMantenimientoEn: number = 0;
  public descripcionComentario: string= null;
  public idDoctora: number = null;
  public idEstado: number = null;
  public observacion: string = '';
  public fechaRegistra: Date = null;
  public usuarioRegistra: string = '';
  public documento: string = '';
  public titulo: string = '';
  public promocion: {
    id: number,
    nombre: string
  } = null;
  public pdf: string = null;
  public emailEnviado: boolean;

  constructor() {
  }
}


export class DocumentoCLiente {
  public id: number;
  public idCliente: number;
  public idDocumentoTipo: number;
  public nombreDocumento: string;
  public idPromocion: number;
  public idZonas: string;
  public idPatologia: string;
  public numeroSesiones: number;
  public numeroSesionesRetroceder: number;
  public sesionesAdicionales: number;
  public intervaloMantenimiento: number;
  public consultaMantenimientoEn: number;
  public descripcionComentario: string;
  public idDoctora: number;
  public idEstado: number;
  public observacion: string;
  public fechaRegistra: Date | null;
  public usuarioRegistro: string;
  public motivoAnulacion: string;
  public dniApoderado: string;
  public nombreApoderado: string;
  public version: number;

  public idUsuarioRegistro: number;
  public idUsuarioModifico: number;
  public usuarioModifico: string;
  public fechaModifico: Date | null;
  public fechaDocumento: Date | null;
  public condiciones: string | null;
  public enviarCorreo: boolean;

  public emailEnviado: boolean;

  public confirmado: number;
  public fechaConfirmo: Date;

  // input secundario
  public documento: string;
  public titulo: string;

  // output secundario
  public nombreCliente: string;
  public tipoDocumentoIdentidad: string;
  public documentoIdentidad: string;
  public zonas: DC_Zona[];
  public patologias: DC_Patologia[];
  public fechaNacimiento: Date | null;
  public nombreDoctora: string;
  public promocion: string;
  public direccion: string | null;
  public distrito: string | null;
  public plantilla: string;
  public listaZonas: string | null;

  public mensajeAviso: string | null = null;
  public parametros?: any = {};
  constructor() {
    this.id = 0;
  }
}

export class DC_Zona{
  public id: number;
  public nombre: string;
}

export class DC_Patologia{
  public id: number;
  public nombre: string;
}
