
export class Venta {
  public id: number;
  public idSede: number;
  public sede: string;
  public totalVenta: number;
  public fecha: Date;
  constructor() {
  }
}


export class VentaPotencial{
  public idCliente: number;
  public cliente: string;
  public sede: string;
  public medioContacto: string;
  public servicio: string;
  public clienteActivo: string;
  public citas: VentaPotencial_Citas[] = [];
}

export class VentaPotencial_Citas{
  public atendidoPor: string;
  public fechaCita: Date;
  public total: number;
}
