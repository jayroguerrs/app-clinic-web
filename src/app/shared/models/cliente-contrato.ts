export class ClienteContrato {
    public id: number;
    public idCliente: number;
    public idDocumentos: string;
    public idUsuarioRegistro: number;
    public idUsuarioModifico: number;
    public fechaRegistro: Date;
    public fechaModifico: Date | null;
    public contrato: string;
    public idEstado: number;
    public clienteEmail: string;
    public observacion: string | null;
    public idServicio: number;
    public confirmado: number;
    public fechaConfirmo: Date | null;

    //inputs
    public fecha: string;
    public enviarCorreo: boolean;
    public idPlantilla: number;

    //outputs
    public usuarioRegistro: string;
    public usuarioModifico: string | null;
    public emailEnviado: boolean = false;

    public tituloContrato: string;
    public nombreCliente: string;
    public tipoDocumentoIdentidad: string;
    public documentoIdentidad: string;
    public documentos: CC_Documento[];
    public documentosRenderizados: CC_DocumentosRenderizados[] = [];
    public listaDocumentos : string | null;
    public servicio: string;
    public servicioColor: string;

    constructor(
    ) {  }
}

export class CC_DocumentosRenderizados{
  id: number;
  titulo: string;
  contenidoBase64: string;
  parametros?: any;
  constructor() {
  }
}

export class CC_Documento{
  public id: number;
  public nombre: string;
  public promocion: string;
  public zonas: string;
  constructor() {
  }
}
