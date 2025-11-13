import {Servicio} from "./servicio";

export class MaquinaMarca{
  id: number;
  nombre: string;
  nombreCorto: string;
  idUsuarioRegistro: number;
  idUsuarioModifico: number;
  fechaRegistro: Date;
  fechaModifico: Date | null;
  idEstado: number;
  idServicios: number[];
  servicios: Servicio[] = [];


  // secondary
  usuarioRegistro: string;
  usuarioModifico: string | null;
  estado: string;
  constructor() {
  }
}
