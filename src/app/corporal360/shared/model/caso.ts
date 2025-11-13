export class Caso{
  id: number;
  nombre: string;
  idUsuarioRegistro: number;
  idUsuarioModifico: number;
  fechaRegistro: Date;
  fechaModifico: Date | null;
  idEstado: number;

  // secondary
  usuarioRegistro: string;
  usuarioModifico: string | null;
  estado: string;
  constructor() {
  }
}
