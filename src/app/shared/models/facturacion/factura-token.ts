export class FacturaToken{
  id: number;
  ruta: string;
  token: string;
  idUsuarioRegistro: number;
  idUsuarioModifico: number;
  fechaRegistro: Date;
  fechaModifico: Date | null;
  idEstado: number;
  idSede: number;

  // secondary
  usuarioRegistro: string;
  usuarioModifico: string | null;
  estado: string;
  sede: string;
  constructor() {
  }
}
