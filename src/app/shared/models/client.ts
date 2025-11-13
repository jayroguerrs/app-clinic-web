export class Client{

  // primary
  public id: number;
  public nombres: string;
  public apellidos: string;
  public seudonimo: string = null;
  public correo: string = null;
  public celular1: string = null;
  public celular2: string = null;
  public fechaNacimiento: Date = null;
  public direccion: string = null;
  public foto: string = null;
  public documentoIdentidad: string = null;
  public peso: number;
  public altura: number;
  public numeroHijos: number;
  public idComunicacionCliente: number;
  public idMedioContacto: number;


  // secondary
  public distrito: string = null;
  public tipoDocumentoIdentidad: string = null;
  public encontrado: boolean;
  public tieneCredenciales: boolean;
  public genero: string = null;
  public edad: number;
  public mensaje: string;

  constructor() {
  }
}

export class ClientData{

  public direccion: string | null = null;
  public documentoIdentidad: string | null = null;
  public celular1: string | null = null;
  public celular2: string | null = null;
  public idGenero: string | null = null;
  public correo: string | null = null;
  public fechaNacimiento: string | null = null;

  constructor() {
  }
}


export class ClientAccess{

  // primary
  public idCliente: number;
  public correo: string;
  public clave: string;
  public fechaRegistro: Date;
  public fechaModifico: Date;


  // secondary
  public parametro: string;
  public mensaje: string;
  public encontrado: boolean;

  constructor() {
  }
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
