export class Tecnologia{
  id: number;
  nombre: string;
  nombreCorto: string;
  descripcion: string;
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

  minutos: number

  edited = false;

  constructor() {
    this.minutos = 10;
  }
}
