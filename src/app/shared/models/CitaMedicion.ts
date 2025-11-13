export class CitaMedicion{
  public id: number;
  public idCita: number;
  public idTipoMedicion: number;
  public idAlternativaMedicion: number;

  // fecha creacion
  public fechaRegistro: Date;
  public usuarioRegistro: string;
  public fechaModifico: Date;
  public usuarioModifico: string;

  public idUsuarioModifico: number;
  public idUsuarioRegistro: number;

  constructor() {
  }
}


export class CitaMedicionGeneral{
  public idCita: number;
  public idSede: number;
  public cliente: string;
  public idCliente: number;
  public genero: string;

  public idEstado: number;
  public estado: string;
  public estadoColor: string;
  public tipoMedicion: string;
  public alternativa: string;

  public fechaRegistro: Date;
  public usuarioRegistro: string;
  public usuarioAtendio: string | null;

  public idServicio: number;
  public servicio: string;
  public servicioColor: string;

  public siguienteCita: number | null;

  constructor() {
  }
}
