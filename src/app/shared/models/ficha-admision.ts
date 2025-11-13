export class FichaAdmision{
  public id: number;
  public idCliente: number;
  public fechaRegistro: Date;
  public fechaModifico: Date | null;

  public patologias: FA_Patologia[] = [];
  public idUsuarioRegistra: number;
  public idUsuarioEdita: number;

  // secondary
  public usuarioRegistro: string;
  public usuarioModifico: string;
  constructor() {
  }
}

export class FA_Patologia{
  public id: number;
  public nombre: string;
  public activo: boolean;
}
