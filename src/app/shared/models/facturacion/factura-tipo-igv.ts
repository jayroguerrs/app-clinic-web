export class FacturaTipoIgv{
  id: number;
  nombre: string;
  descripcion: string | null;
  valor: string;
  idUsuarioRegistro: number;
  idUsuarioModifico: number;
  fechaRegistro: Date;
  fechaModifico: Date | null;
  idEstado: number;
  aplicaIgv: boolean;
  gratuita: boolean;
  inafecta: boolean;
  exonerada: boolean;

  // secondary
  usuarioRegistro: string;
  usuarioModifico: string | null;
  estado: string;
  constructor() {
  }
}
