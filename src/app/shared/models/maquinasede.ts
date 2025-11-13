export class maquinasede {
    constructor(
      public idmaquinasede: number,
      public nombre: string,
      public direccion: string,
      public descripcion: string,
      public estado: number
    ) {  }
}

export class MaquinaSede{
  public id: number;
  public idEstado: number;
  public idFicticio: number;
  public idMaquina: number;
  public maquina: string;
  public idServicio: number;
  public servicio: string | null;
  public servicioColor: string | null;
  public horaInicio: string;
  public horaFin: string;
  public descripcion: string;
  public idSede: number;
  public sede: string;
  public color: string;

  public usuarioRegistra: string;
  public usuarioEdita: string;
  constructor() {
  }
}
