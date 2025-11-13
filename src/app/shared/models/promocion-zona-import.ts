export class IPromocionImportclass {
    
    constructor(
      public id:number,  
      public zona: string,
      public promocion:string,
      public duracion:string,
      public documento:number
    ) {  }
  }
  export class IZonaPromocionImportclass {
    
    constructor(
      public idpromocion:number,
      public promocion:string,
    ) {  }
  }