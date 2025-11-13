export class Servicio{
  id: number;
  nombre: string;
  nombreCorto: string;
  idUsuarioRegistro: number;
  idUsuarioModifico: number;
  fechaRegistro: Date;
  fechaModifico: Date | null;
  idEstado: number;
  color: string;

  // secondary
  usuarioRegistro: string;
  usuarioModifico: string | null;
  estado: string;
  constructor() {
  }
}
