export class FacturaSerie{
  id: number;
  serie: string;
  idSede: number;
  idUsuarioRegistro: number;
  idUsuarioModifico: number;
  fechaRegistro: Date;
  fechaModifico: Date | null;
  idEstado: number;

  // secondary
  usuarioRegistro: string;
  usuarioModifico: string | null;
  estado: string;
  sede : string;
  constructor() {
  }
}
