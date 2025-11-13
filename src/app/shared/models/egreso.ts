export class Egreso {
    constructor(
      public Id: number,
      public Decimal: number,
      public IdCaja: number,
      public Caja: string,
      public IdUsuario: number,  
      public Usuario: string,
      public IdSede: number,  
      public Sede: string,
      public Observacion: string,
    ) {  }
  }