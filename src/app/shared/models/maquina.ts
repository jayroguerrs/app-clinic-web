export class maquina {
    constructor(
      public idMaquina: number,
      public descripcion: string,
      public horaInicio: string,
      public horaFin: string,
      public estado: number,
      public usuarioRegistra: string,
      public fechaRegistra: string,
      public usuarioModifica: string,
      public fechaModifica: string
    ) {  }

}

export class MaquinaMinutos {
  public citas: number;
  public idMaquina: number;
  public sede: string;
  public minutos: number;
  public porcentaje: number;

  constructor() {
  }
}

export class MaquinaSedePerfil{
  public id: number;
  public idMaquinaSede: number;
  public idPerfil: number;
  public perfil: string;
  public idUsuarioRegistro: number;

  // secondary
  public idPerfiles: number[];
  public maquina: string;
  public usuarioRegistro: string;
  constructor() {
  }
}

