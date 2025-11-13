export class FormularioEncuesta{
  public id: number;
  public nombre: string;
  public fechaRegistro: Date;
  public idUsuarioRegistro: number;
  public fechaModifico: Date | null;
  public idUsuarioModifico: number | null;
  public idEstado: number;
  public realizado: boolean;


  public usuarioRegistro: string;
  public usuarioModifico: string | null;

  public preguntas: FormularioEncuestaPregunta[] = [];

  constructor() {
  }
}


export class FormularioEncuestaPregunta{
  public id: number;
  public idFormularioEncuesta: number;
  public texto: string;
  public multiple: boolean;
  public fechaRegistro: Date;
  public idUsuarioRegistro: number;
  public fechaModifico: Date | null;
  public idUsuarioModifico: Date | null;
  public orden: number;
  public idEstado: number;
  public tipoRespuesta: string;
  public obligatorio: boolean = false;

  public usuarioRegistro: string;
  public usuarioModifico: string | null;

  public opciones: FormularioEncuestaOpcion[] = [];

  public respuestas: string[] = [];
  public respuesta: string | null = null;


  constructor() {
  }
}

export class FormularioEncuestaOpcion{
  public id: number;
  public idFormularioPregunta: number;
  public valor: string;
  public adicional: boolean;
  public placeholderAdicional: string = null;
  public fechaRegistro: Date;
  public idUsuarioRegistro: number;
  public fechaModifico: Date | null;
  public idUsuarioModifico: Date | null;
  public orden: number;
  public idEstado: number;


  public contador: number = 0;

  public usuarioRegistro: string;
  public usuarioModifico: string | null;

  constructor() {
  }
}


export class FormularioEncuestaRespuesta{
  public id: number;
  public idFormulario: number;
  public idCliente: number;

  public idSede: number;

  public fechaRegistro: Date;
  public idUsuarioRegistro: number;
  public fechaModifico: Date | null;
  public idUsuarioModifico: Date | null;

  public respuestas: FormularioRespuesta[] = [];

  constructor() {
  }
}

export class FormularioRespuesta{

  public id: number;
  public idPregunta: number = 0;
  public idRespuesta: number = 0;
  public idRespuestas: string = '';

  public adicional: boolean = false;
  public tipo: string = '';
  public respuestaAdicional: string  = null;
  public respuestaTexto: string | null = null;

  constructor() {
  }
}
