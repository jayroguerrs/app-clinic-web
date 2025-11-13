import {Tecnologia} from "../tecnologia";

export class MaquinaSedeDisponible{
  fecha: Date;
  porcentaje: number;
  idServicio: number;
  idSede: number;

  // secondary
  servicio: string | null;
  sede: string | null;

  constructor() {
  }
}

export class MaquinaSede{
  id: number;
  idMaquina: number
  porcentaje: number;
  idServicio: number;
  idSede: number;
  // tecnologias: MaquinaSedeTecnologia[] = [];
  idUsuarioRegistro: number;

  // secondary
  servicio: string | null;
  sede: string | null;
  maquina: string | null;
  tecnologias: Tecnologia[] = [];

  constructor() {
  }
}


export class Maquina{
  id: number;
  nombre: string;
  idEstado: number;
  idUsuarioRegistro: number;
  fechaRegistro: Date;
  idUsuarioModifico: number | null;
  fechaModifico: Date | null;

  //secondary
  usuarioRegistro: string;
  usuarioModifico: string | null;
  constructor() {
  }
}

