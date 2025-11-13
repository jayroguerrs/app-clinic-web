export class contrato {
    
    constructor(
      public idContrato: number,
      public fechaContrato:string,
      public codigoContrato: string,
      public codigoTabla: string,
      public descripcion: string,
      public firmaCliente: string,
      public idCliente: string
    ) {  }
  
  }
  export class eliminarcontrato {
    
    constructor(
      public idCliente: string,
      public codigoTabla: string
    ) {  }
  
  }