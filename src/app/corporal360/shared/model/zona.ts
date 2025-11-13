export class Zona{
  id: number;
  nombre: string;
  idUsuarioRegistro: number;
  idUsuarioModifico: number;
  fechaRegistro: Date;
  fechaModifico: Date | null;
  idGenero: number;
  idEstado: number;

  // secondary
  usuarioRegistro: string;
  usuarioModifico: string | null;
  genero: string;
  estado: string;
  servicios: ZonaServicio[] = [];
  constructor() {
  }
}

export class ZonaServicio{
  idZona: number;
  nombre: string;
  nombreCorto: string;
  duracion: number;
}
