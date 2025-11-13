export class ReporteAperturaEnt {
    constructor(
      public idVenta:number,
      public NumeroDocumento: string,
      public IdCita:number,
      public Caja: string,  
      public IdCaja:number,
      public Cliente: string,
      public IdCliente:number,
      public IdDocumento:number,
      public Documento: string,
      public IdTipoPago:number,
      public TipodePago: string,
      public pagado: string,
      public Fecha: string,
      public hora: string,
      public UsuarioRegistro: string,  
      public efectivo: string,
      public tarjetadecredito: string,
      public deposito: string,
     
    ) {  }
  }