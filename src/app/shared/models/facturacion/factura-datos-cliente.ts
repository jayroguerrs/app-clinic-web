export class FacturaDatosCliente {
  public id: number;
  public idCliente: number;
  public idTipoDocumentoCliente: string | null;
  public numeroDocumentoCliente: string;
  public nombreCliente: string;
  public direccion: string;

  public idUsuarioRegistro: number;
  public idUsuarioModifico: number | null;
  public fechaRegistro: Date;
  public fechaModifico: Date;
  public predeterminado: boolean;
  public idEstado: number;

  // secondary
  public tipoDocumentoCliente: string;
  public tipoDocumentoClienteValor: string;
  public usuarioRegistro: string;
  public usuarioModifico: string | null;
  public estado: string;
  constructor() {
    this.idEstado = 1;
    this.predeterminado = false;
  }
}
