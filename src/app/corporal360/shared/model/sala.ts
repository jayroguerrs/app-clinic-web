import {Servicio} from "../../../shared/models/corporal-360/servicio";

export class Sala {
  id: number;
  nombre: string;
  idUsuarioRegistro: number;
  idUsuarioModifico: number;
  fechaRegistro: Date;
  fechaModifico: Date | null;
  idSede: number;
  idEstado: number;

  // secondary
  usuarioRegistro: string;
  usuarioModifico: string | null;
  estado: string;
  sede: string;
  servicios: Servicio[] = [];
  constructor() {
  }
}
