export class Caja {
    constructor(
      public idCaja: number,
      public descripcion: string,
      public sede: string,
      public idSede: string,
      public lActivo: string
    ) {  }
  }

export class CuadreCaja{
  public idCaja: number;
  public nombreCaja: string;
  public fechaCuadre: Date;

  constructor() {
  }
}
