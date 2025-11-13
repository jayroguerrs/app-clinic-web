export class TipoCita {

    constructor(
      public IdTipoCita: number,
      public descripcion: string,
      public estado: string,
      public usuariomodifica: string,
      public fechamodifica: string,
      public usuarioregistra: string,
      public fecharegistra: string,
          ) {  }
  }