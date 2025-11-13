export class Tratamiento{
  id: number;
  nombre: string;

  idUsuarioRegistro: number;
  idUsuarioModifico: number;
  fechaRegistro: Date;
  fechaModifico: Date | null;
  idEstado: number;
  idServicio: number;

  // secondary
  usuarioRegistro: string;
  usuarioModifico: string | null;
  servicio: string;
  servicioColor: string;
  estado: string;

  constructor() {
  }
}
