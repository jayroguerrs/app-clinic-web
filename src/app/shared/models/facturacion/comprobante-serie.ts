export class ComprobanteSerie{
  id: number;
  idSede: number;
  idTipoComprobante: number;
  serie: string;
  numeroActual: number;
  descripcion: string | null;
  idUsuarioRegistro: number;
  idUsuarioModifico: number;
  fechaRegistro: Date;
  fechaModifico: Date | null;
  idEstado: number;

  // secondary
  sede: string;
  tipoComprobante: string;
  usuarioRegistro: string;
  usuarioModifico: string | null;
  estado: string;
  numeroComprobante: number;
  constructor() {
  }
}
