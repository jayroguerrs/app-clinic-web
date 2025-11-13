export class CitaMotivoEstado{
  public id: number = 0;
  public idCita: number = 0;
  public idMotivo: number = 0;
  public fechaRegistro: Date = null;
  public usuarioRegistro: string = null;
  public fechaModifico: Date = null;
  public usuarioModifico: string = null;

  constructor() {
  }
}

export class CitaMotivo{
  public id: number = 0;
  public motivo: string = null;
  public idCitaEstado: number = 0;

  constructor() {
  }
}
