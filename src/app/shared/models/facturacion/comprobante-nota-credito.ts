export class ComprobanteTipoNotaCredito{
  id: number;
  nombre: string;
  descripcion: string | null;
  valor: string;
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


export class ComprobanteNotaCredito{
  id: number;
  serie: string;
  numero: number;

  observaciones: string | null;

  idTipoComprobante: number;
  comprobante: string;
  tipoComprobanteValor: string;
  idComprobante: number;
  idTipoNotaCredito: number;

  idUsuarioRegistro: number;
  idUsuarioModifico: number;

  fechaRegistro: Date;
  fechaModifico: Date | null;

  // Secundario
  usuarioRegistro: string;
  usuarioModifico: string | null;
  tipoNotaCredito: string;
  tipoComprobante: string;
}
