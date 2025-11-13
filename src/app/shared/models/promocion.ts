export class Promocion{
  public id: number;
  public nombre: string;
  public fechaInicio: Date;
  public fechaFin: Date;
  public idEstado: number;
  constructor() {
  }
}

export class promocion{

    constructor(

        public idPromocion: number,
        public descripcion: string,
        public fechaInicio: string,
        public fechaFin: string,

        public lu: boolean,
        public ma: boolean,
        public mi: boolean,
        public ju: boolean,
        public vi: boolean,
        public sa: boolean,
        public dom: boolean,

        public condicion: string,

        public refPrecio: number,
        public zonaUsar: number,
        public idperfil: number,
        public activo: number,
        public usuarioRegistra: string,
        public usuarioModifica: string
    ){

    }

}


export class PromocionRanking{
  public fechaCita: Date;
  public idPromocion: number;
  public promocion: string;
  public total: number;
  public numZonas: number;

  public idSede: number;
  public sede: string;
}


export class PromocionZonaRanking{
  public idZona: number;
  public zona: string;
  public cantidad: number;
  public total: number;
}


export class PromocionCategoria{
  public id: number;
  public nombre: string;
  public idUsuarioRegistro: number;
  public idUsuarioModifico: number | null;
  public fechaRegistro: Date;
  public fechaModifico: Date | null;
  public idEstado: number;

  // secondary
  public usuarioRegistro: string;
  public usuarioModifico: string | null;
}



export class PromocionZona{
  public id: number;
  public idPromocionPrecio: number;
  public idPromocion: number;
  public promocion: string;
  public nombre: string;
  public idZona: number;
  public idGenero: number;
  public precioBase: number;
  public precioPromocion: number;
  constructor() {
  }
}
