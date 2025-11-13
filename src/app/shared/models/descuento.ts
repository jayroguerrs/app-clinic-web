export class Descuento {

      public id: number;
      public nombre: string;
      public porcentaje: number;
      public idZona: number;
      public idCategoria: number;
      public idGenero: number;
      public idEstado: number;
      public fechaInicio: Date | null;
      public fechaFin: Date | null;

      public usuarioRegistro: string;
      public usuarioModifico: string;

      constructor() {
      }

}
