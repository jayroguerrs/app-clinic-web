export class ClienteIncidencia{
  public id: number;
  public idCliente: number;
  public idCita: number;
  public descripcion: string;
  public idUsuarioRegistro: number;
  public idUsuarioModifico: number | null;
  public fechaRegistro: Date;
  public fechaModifico: Date | null;

  // secondary
  public cliente: string;
  public sede: string;
  public usuarioRegistro: string;
  public usuarioModifico: string | null;

  constructor() {
  }
}
