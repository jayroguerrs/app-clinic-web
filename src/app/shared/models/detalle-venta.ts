export class DetalleVentaClass {
    constructor(
      public dVenta: number,
      public numeroDocumento: string,
      public serie: string, 
      public numero: string,   
      public fechaRegistro: string, 
      public idZona: number,
      public descripcion: string, 
      public cantidad: string, 
      public pImporte: string,
      public pTotal: string,
      public idVenta: number,
      public consolidado: string,
    ) {  }
  }