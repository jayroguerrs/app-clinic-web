export class IZonaPromocionesImportclass {
    constructor(
      public idZona:Number,  
      public descripcion: string,
      public duracion:string,
      public opromociones:opromociones[],
    ) {  }
  }
  export class opromociones {
    constructor(
      public idPromociones: Number,
      public promociones: string,
    ) {  }
  }
  