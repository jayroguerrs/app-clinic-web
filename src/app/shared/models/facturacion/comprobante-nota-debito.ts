export class ComprobanteTipoNotaDebito{
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
