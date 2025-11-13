export class ubicacion {

  constructor(
    public idUbicacion: number,
    public distrito: string,
    public ciudad: string,
    public departamento: string,
    public pais: string,
  ) {  }

}

export class UDepartamento{
  public id: string;
  public nombre: string;
  constructor() {
  }
}

export class UCiudad{
  public id: string;
  public nombre: string;
  constructor() {
  }
}

export class UDistrito{
  public id: string;
  public nombre: string;
  constructor() {
  }
}
