export class Cliente{
  public id: number;
  public nombres: string;
  public apellidos: string;
  public distrito: string;
  public direccion: string;
  public documento: string;
  public documentoIdentidad: {
    id: number;
    documento: string;
    tipoDocumento: string;
  }
  public idTipoDocumentoIdentidad : number;

  public idGenero: number;
  public fechaNacimiento: Date | null;
  public telefono1: string;
  public telefono2: string;
  public departamento: string;
  public provincia: string;
  public correo: string;
  public edad: number | null;
  public idUbicacion: string | null;
  public seudonimo : string | null;
  public idMedioContacto: number | null;

  // secondary
  public fechaEncuesta: Date;
  public encuesta: string;
  public genero: string | null;
  public medioContacto: string;
  public paisCelular1: number;
  public paisCelular2: number | null;
  public ruc:string;
  public razonSocial:string



  constructor() {
  }

}

export class ClienteClass {
  constructor(
    public idCliente: number,
    public nombre: string,
    public apellido: string,
    public seudonimo: string,
    public idGenero: string,
    public celular1: string,
    public celular2: string,
    public correo: string,
    public direccion: string,
    public medioContacto: string,
    public publicidad: string,
    public feNaci: string,
    public estado: number,
    public fechaRegistro: string,
    public usuarioRegistro: string,
    public serieFirma: string,
    public serieHuella: string,
    public dni: string,
    public idUbicacion: string,
    public colorEstado: string
  ) {  }
}

export class ClienteImportClass {
  public id: number = 0;
  public nombres: string = '';
  public apellidos: string = '';
  public nombresCompletos: string = '';
  public numerosCelulares: string = '';
  public celular1: string = '';
  public celular2: string = '';
  public tipoDocumento: number;
  public documento: string = '';
  public seudonimo: string = '';
  public edad: number = 0;
  public idGenero: number = 0;
  public idHistoriaClinica: string = '';
  public ruc: string = '';
  public razonSocial: string = '';

  constructor() {  }
}



export class ClienteEncuesta {
  id: number;
  idCliente: number;
  idDistrito: number;
  idSede: number;
  efectividadTrat: number;
  atencionCli: number;
  claridadInfo: number;
  brindoInfoPromo: number;
  medio: number;
  sugerencias: string;
  idEspecialista: number;
  fechaCreacion: Date;

  vcliente: string;
  vdistrito: string;
  vsede: string;
  vefectividadTrat: string;
  vatencionCli: string;
  vclaridadInfo: string;
  vbrindoInfoPromo: string;
  vmedio: string;
  vespecialista: string;
  constructor() {
  }
}

export class ClienteEncuestaResultado {
  total: number;
  item: string;
  constructor() {
  }
}

export class ClienteEncuestaPregunta {
  id: number;
  nombre: string;
  resultados: ClienteEncuestaResultado[] = []
  constructor() {
  }
}

export class ClienteAcceso{
  idCliente: number;
  correo: string;
  clave: string;
  fechaRegistro: Date | null;
  idUsuarioModifico: number | null;
  fechaModifico: Date | null;
  registrado: boolean = false;

  //secondary
  usuarioModifico: string;
}

export class ClienteFinanciamiento{

  public idOrden: number;
  public idSubscripcion: number;
  public estado: string;
  public idProducto: number;
  public nombreProducto: string;
  public cuota: number;
  public fechaRegistro: Date;
  public fechaPago: Date | null;
  public proximaFacturacion: Date | null;
  public total: number;
  public totalNeto: number;
  public idCliente: number;
  public nombreCliente: string;
  public apellidoCliente: string;
  public documentoCliente: string;

  constructor() {
  }
}


export class ClienteNuevoReporte{
  public  id: number;
  public  nombres: string;
  public  apellidos: string;
  public  tipoCliente: string;
  public  genero: string;
  public  celular: string;
  public  correo: string;
  public  numeroDocumento: string;
  public  documento: string;
  public  medioContacto: string;
  public  fechaRegistro: Date;
  public  distrito: string;

  constructor() {
  }
}


export class ClienteRuc{
  public  ruc: string;
  public  razonSocial: string;

  constructor() {
  }
}

export class ClienteDNI{
  public  dni: string;
  public  nombresCompleto: string;
  public  nombres: string;
  public  apellidoPaterno: string;
  public  apellidoMaterno: string;

  constructor() {
  }
}




export class ClienteAsignado{
  public id: number;
  public idCliente: number;
  public fechaCita: Date;
  public idUsuarioOperador: number;
  public fechaAsignacion: Date;
  public fechaConfirmacion: Date;
  public idUsuarioRegistro: number;
  public fechaRegistro: Date;
  public idEstado: number;
  public idTipo: number;
  public fechaEdito: Date | null;
  public idEstadoCliente: number;

  // secondary
  public nombres: string;
  public apellidos: string;
  public usuarioOperador: string;
  public usuarioOperadorNombre: string;
  public usuarioRegistro: string;
  public usuarioRegistroNombre: string;
  public estado: string;
  public estadoColor: string;
  public tipo: string;
  public tipoCliente: string;
  public telefono: string;
  public sede: string;

  public idUsuario: number;
  public usuario: string;
  public numClientes: number;
  public estadoCliente: string;
  public estadoClienteColor: string;

  // table
  public seleccionado: boolean;
  public asignado: boolean;

  constructor() {
    this.seleccionado = false;
    this.asignado = false;
    this.idUsuario = 0;
    this.idEstadoCliente = 0;
  }
}



export class ClienteAsignadoEstado{
  public id: number;
  public estado: string;
  public color: string;
  public idEstadoCliente: 0;

  constructor() {
  }
}


export class ClienteAsignadoHistorial{
  public id: number;
  public idClientAsignado: number;
  public asignadoPor: string;
  public asignadoA: string;
  public fechaRegistro: Date;
  constructor() {
  }
}

