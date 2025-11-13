export class sede{
    constructor(

        public idsede: number,
        public nombre: string,
        public estado: number,

        public idubicacion: string,

        public departamento: string,
        public ciudad: string,
        public distrito: string,
        public usuarioregistra: string,
        public usuariomodifica: string,
        public iddepartamento: string,
        public idciudad: string,
        public direccion: string,
        public horaInicio: string,
        public horaFin: string
    ){}

}

export class Sede{
  public id: number;
  public nombre: string;
  public totalVenta: number;
  constructor() {
  }
}
