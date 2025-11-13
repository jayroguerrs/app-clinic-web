import {number} from "@amcharts/amcharts4/core";

export enum TipoPerfil{
    TODOS = 0,
    SA = 1,
    CONTADOR = 2,
    VENTAS = 3,
    SUPERVISOR = 4,
    OPERADOR = 5,
    ADMINISTRADOR = 6,
    SISTEMAS = 7,
    GERENCIA = 8,
    ESPECIALISTA = 9,
    CONTABILIDAD = 10,
    MARKETING = 11,
    SUPERVISORVENTAS = 12,
    ATENCIONCLIENTE = 13,
    COMMUNITYMANAGER = 14,
    ADMINISTRADOR2 = 15,
    COORDINADOR_VENTAS_Y_MARKETING = 16,
    ADMINISTRADOR_3 = 17,
    RECURSOS_HUMANOS = 18
  }
export enum AccionCita{
    VER = 1,
    EDITAR = 2,
    ATENDER = 3,
    NUEVA = 4,
    SIGUIENTE = 5,
    CONFIRMAR = 6,
    EMISION = 7,
    CONFIRMARASISTENCIA = 8
  }

export enum AccionCronograma{
  NUEVA = 1,
  EDITAR = 2,
  VER = 3,
  ASIGNARCITAS = 4
}

export enum TipoEventoSignalR{
  CerrarSesion = 1,
  ActualizarSistema = 2
}

export enum TipoMensajeSignalR{
    Actividad = 1,
    RespuestaActividad = 2,
    PreferenteAsignado = 3,
    RetornoPreferente = 4,
    // ConnectionId = 5,
    ConexionNueva = 6,
    ConexionRechazada = 7,
    ConexionListaUsuario = 8,
    DesconexionUsuario = 9,
    NuevoMensaje = 10,
    CitaReservada = 11,
    ReservaEliminada = 12,
    AvisoGeneral = 13,
    MenuActualizado = 14,
    CerrarSesion = 15,
    ActualizarSistema = 16,
    PreferenteCambioEstado = 17,
    PreferentesAsignados = 18,
    AtendiendoPreferente = 19,
    PreferenteAtendido = 20,
    NuevoPreferente = 21,
    NotificacionDePago = 22,
    CitaPagada = 23
  }
export enum CitaEstado{
    REGISTRADA = 5,
    CONFIRMADA = 6,
    ATENDIDA = 7,
    CANCELADA = 8,
    ANULADA = 9,
    REPROGRAMADA = 10,
    PENDIENTE = 30,
    ASISTENCIACONFIRMADA =34,
    GENERADOPORSISTEMA =35,
    NOLLAMAR= 54,
    NOASISTIO = 81
}

export enum PreferenteEstadoAtencion{
  SinComentario = 14,
  Agendo = 15,
  NoAtendio = 16,
  ClienteLlamaraLuego = 17,
  LlamarAlClienteLuego = 18,
  NoDeseaTratamiento = 19,
  YaFueLlamado = 20,
  YaEsCliente = 21,
  SoloInformacion = 22,
  InformacionAlWhatsapp = 23,
  NumeroEquivocado = 24,
  NumeroInactivo = 25,
  TelefonoApagado = 26,
  NoApto = 27
}

export enum VariableMedicion{
  SATISFACCION = 1,
  EFECTIVIDAD = 2
}

export enum ComunicacionCliente{
    TELEFONO = 1,
    WHATSAPP = 2,
    EMAIL = 3
  }
export enum DiaSemana{
    Lunes = 1,
    Martes= 2,
    Miercoles= 3,
    Jueves= 4,
    Viernes= 5,
    Sabado= 6,
    Domingo= 7,
  }
export enum Meses{
    Enero = 1 ,
    Febrero = 2 ,
    Marzo = 3 ,
    Abril = 4 ,
    Mayo = 5 ,
    Junio = 6 ,
    Julio = 7 ,
    Agosto = 8 ,
    Setiembre = 9 ,
    Octubre = 10 ,
    Noviembre = 11 ,
    Diciembre = 12
}

export enum DocumentoTipos{
    CONT_DEP_ESP = 1,
    CONT_MAN_ESP = 2,
    CONT_RET_ESP = 3,
    CONT_MAN_DOC = 4,
    CONT_RET_DOC = 5,
    CONS_INF_ESP = 12,
    CONS_INF_DOC = 13,
    ALTA_MED_ESP = 14,
    ALTA_MED_DOC = 15
}

export enum TiposDocumento{
  CONT_SERV_DEPI	= 1,	 //Contrato servicio de depilación
  CONS_MANT_ESPE = 9, //	Constancia mantenimiento especialista
  CONS_MANT_DOCT = 17, //	Constancia mantenimiento doctora
  CONS_RETO_ESPE = 11, //	Constancia retoque especialista
  CONS_RETO_DOCT = 19, //	Constancia retoque doctora
  CONT_SIN_GARAN_DOCT = 16, //	Constancia retoque doctora
  CONS_INFO_MENO_EDAD_DOCT = 15, //	Consentimiento informado empresa patologia doctora
  CONS_INFO_EMPR_DOCT = 14, //	Consentimiento informado empresa patologia doctora
  CONS_ALTA_MEDI_ESPE = 5, //	Constancia alta medica especialista
  CONS_ALTA_MEDI_DOCT = 13, //	Constancia alta media doctores
  CONT_REIN_TRAT_DOCT =	18, //	Contrato de reinicio de tratamiento doctora
  CONS_INFO_HIPER = 2, //	Consentimiento informado hiperpigmentación
  CONS_INFO_OVAR_POLI = 3, //	Consentimiento informado ovarios poliquistico
  TRAN_EXTR =	4, //	Transacción extrajudicial
  CONS_INFO_GENE_ESPE = 6, //	Consentimiento informado general especialista
  CONS_INFO_MENO_EDAD_ESPE = 7, //	Consentimiento informado menor de edad especialista
  CONT_SIN_GARAN_ESPE =	8, //	Contrato de servicio de depilación sin garantía de sesiones adicionales
  CONT_REIN_TRAT_ESPE =	10, //	Contrato de reinicio de tratamiento especialista
  CONT_RETR_SESI_ESPE =	12, //	Contrato de servicio de depilacion (retroceso de sesiones)( especialista )
  CONT_RETR_SESI_DOCT =	20, //	Contrato de servicio de depilacion (retroceso de sesiones)( doctora )
  CONS_INFO_AUT =	21, //	Consentimiento informado de autorización
  RECO_CLIENTE = 22, //	Informacion sobre el proceso de depilacion
  RESUMEN_CONTRATO = 23, //	Resumen de contrato
  EXEC_RESPONSABILIDAD = 24, // Exepcion de responsabilidad de depilzone
  RECOM_CONTR_REQU = 25, // Recomendaciones, contraindicaciones y requerimientos para llevar a cabo las sesiones de depilación
  CONT_SERV_DEPIV2	= 26,	 //Contrato servicio de depilación
  //CONS_INFO_AUTV2 = 27,
  CONT_SERV_ACLARA	= 30,
  //CONT_SERV_DEPIV2	= 31,
  CONT_INFO_GENE_ACLARA	= 34,
  CONS_INFO_MENO_EDAD_ACLARA	= 35,
  CONT_MATCH_ACLARA_DEPIL	= 38,
  EXEC_RESPONSABILIDAD_V2	= 42,
  CONT_SERV_CORP360	= 46,
  CONT_SERV_DEPIV3 = 103,
  CONT_SERV_DEPIV3_2025 = 272,
  CONT_SERV_TRAT_FACIAL = 109,

  CONT_SERV_TRAT_FACIAL1 = 129,
  CONT_SERV_TRAT_FACIAL2 = 130,
  CONT_SERV_TRAT_FACIAL3 = 131,
  CONT_SERV_TRAT_FACIAL4 = 132,
  CONT_SERV_TRAT_FACIAL5 = 164,

  CONT_SERV_HOLLYWOOD_PEEL = 251,
}

export enum Sedes{
  SAN_BORJA = 1,
  MEGA_PLAZA = 2,
  PUEBLO_LIBRE = 3
}

export enum EnumTipoComprobante{
  FACTURA = 1,
  TICKET = 2,
  BOLETA = 3,
  NOTACREDITO = 4
}


export enum DocumentoPlantillas{
  ResumenDocumento = 23,
  HistoriaClinicaDepilacion = 12,
  FichaCliente = 13,
  ConsentimientoInformadoAutorizacion = 21,
  RecomendacionesCliente = 25,
  InformacionProcesoDepilacion = 22
}

export enum Servicios{
  SERVICIO_DEPILACION = 1,
  BLANQUEAMIENTOCORPORAL = 2,
  CORPORAL360 = 3
}

export enum EnumTipoPago{
  EFECTIVO = 1,
  TARJETACREDITO = 2,
  DEPOSITO = 3,
  DEPILCARD = 4,
  MIXTO = 5,
  TARJETADEBITO = 6
}



export const TipoCicatrizacion: any[] = [
  {index:1, value: 'Buena'},
  {index:2, value: 'Regular'},
  {index:3, value: 'Mala'},
  {index:4, value: 'Queloide'}
]

export const BebeAlcohol: any[] = [
  {index:1, value: 'Socialmente'},
  {index:2, value: 'Comidas'},
  {index:3, value: 'Diariamente'}
]

export const MedioComunicacionCliente: any[] = [
  {index:1, value: 'Teléfono'},
  {index:2, value: 'Whatsapp'},
  {index:3, value: 'Email'}
]

export const MedioContacto: any[] = [
  {index:1, value: 'Facebook'},
  {index:2, value: 'Instagram'},
  {index:3, value: 'Página web'},
  {index:4, value: 'Tiktok'},
  {index:5, value: 'Otros'},
]

export const Ultimos12MesesSeHizo: any[] = [
  {index:1, value: 'Examen médico'},
  {index:2, value: 'Análisis de sangre'},
  {index:3, value: 'Radiografías'}
]

export const ReaccionAlergicaCutanea: any[] = [
  {index:1, value: 'Yodo'},
  {index:2, value: 'Alcohol'},
  {index:3, value: 'Esparadrapo'},
  {index:4, value: 'Bisutería'}
]

export const ColorEstadoCita: any[] = [
  {index:5, value: '#04a9f5', nombre: 'Registrada'},
  {index:6, value: '#1de9b6', nombre: 'Cita Confirmada'},
  {index:7, value: '#28a745', nombre: 'Atendida'},
  {index:8, value: '#343a40', nombre: 'Cancelada'},
  {index:9, value: '#dc3545', nombre: 'Anulada'},
  {index:10, value: '#ffc107', nombre: 'Reprogramada'},
  {index:30, value: '#b734f8', nombre: 'Cita No Contesta'},
  {index:34, value: '#0069d9', nombre: 'Asistencia Confirmada'},
  {index:35, value: '#FF97E8', nombre: 'Generado por el Sistema'},
  {index:54, value: '#a5512a', nombre: 'No llamar'},
  {index:81, value: '#000064', nombre: 'No Asistio'},
  {index:82, value: '#00e7ff', nombre: 'Pagado'},
]

export const ColorServicioCita: any[] = [
  {idServicio:1, value: '#00aded'},
  {idServicio:2, value: '#df9d20'},
  {idServicio:3, value: '#222e74'},
  {idServicio:4, value: '#f7c9a6'},
  {idServicio:9, value: '#f7d397'},
  {idServicio:10, value: '#6cf907'},
  {idServicio:11, value: 'rgba(235,71,220,0.51)'},
  {idServicio:12, value: '#ff9400'},
  {idServicio:13, value: '#6a00ff'},
]

export const ColorTipoCita: any[] = [
  { idTipoCita: 1, value: '#007bff' },
  { idTipoCita: 2, value: '#28a745' },
  { idTipoCita: 3, value: '#dc3545' },
  { idTipoCita: 4, value: '#6f42c1' },
  { idTipoCita: 5, value: '#ffc107' },
  { idTipoCita: 6, value: '#6c757d' },
  { idTipoCita: 7, value: '#fd7e14' },
  { idTipoCita: 8, value: '#17a2b8' },
  { idTipoCita: 9, value: '#343a40' },
];

export const SedesList : any[] = [
  {index: 1, value : 'San Borja'},
  {index: 2, value : 'Mega Plaza'},
  {index: 3, value : 'Pueblo Libre'}
]

export const ServiciosList : any[] = [
  { id: 1, nombre: 'Servicio de Depilación' },
  { id: 2, nombre: 'Blanqueamiento' },
  { id: 3, nombre: 'Corporal 360' },
  { id: 4, nombre: 'Tratamiento Facial' },
  { id: 9, nombre: 'Limpieza Facial' },
  { id: 10, nombre: 'Exfoliación' },
  { id: 11, nombre: 'Dermatología' },
  { id: 12, nombre: 'SERVICIO SIN ASIGNAR' },
  { id: 13, nombre: 'HOLLYWOOD PEEL - CORPORAL' }
]

export enum EnumFacturaTipoDocumento{
  DNI = 1,
  RUC = 2,
  VARIOS = 3,
  CARNET_EXTRANJERIA = 4,
  PASAPORTE = 5,
  CEDULA_DIPLOMATICA_IDENTIDAD = 6,
  NO_DOMICILIADO_SIN_RUC_EXPORTACION = 7
}

export enum EnumComprobanteTipoIgv{
  GRAVADO_OPERACION_ONEROSA = 1,
  GRATUITO_GRAVADO_RETIRO_POR_PREMIO = 2,
  GRATUITO_GRAVADO_RETIRO_POR_DONACION = 3,
  GRATUITO_GRAVADO_RETIRO = 4,
  GRATUITO_GRAVADO_RETIRO_POR_PUBLICIDAD = 5,
  GRATUITO_GRAVADO_BONIFICACIONES = 6,
  GRATUITO_GRAVADO_RETIRO_POR_ENTREGA_A_TRABAJADORES = 7,
  EXONERADO_OPERACION_ONEROSA = 8,
  INAFECTO_OPERACION_ONEROSA = 9,
  GRATUITO_INAFECTO_RETIRO_POR_BONIFICACION = 10,
  GRATUITO_INAFECTO_RETIRO = 11,
  GRATUITO_INAFECTO_RETIRO_POR_MUESTRAS_MEDICAS = 12,
  GRATUITO_INAFECTO_RETIRO_POR_CONVENIO_COLECTIVO = 13,
  GRATUITO_INAFECTO_RETIRO_POR_PREMIO = 14,
  GRATUITO_INAFECTO_RETIRO_POR_PUBLICIDAD = 15,
  EXPORTACION = 16,
  GRATUITO_EXONERADO_TRANSFERENCIA_GRATUITA = 17,
}

export enum EnumUnidadMedida{
  Servicio = 1,
  Producto = 2
}


export enum EnumServicio{
  Depilacion = 1,
  Blanqueamiento = 2,
  Corporal360 = 3,
  TratamientoFacial = 4,
  Exfoliacion = 10,
  Dermatologia = 11,
  HollywoodPeel = 13
}


export enum EstadoAtencionClienteAsignado{
  Pendiente = 1,
  Visto = 2,
  Trabajado = 3,
}

export enum EstadoClienteAsignado{
  Confirmada = 1,
  AsistenciaConfirmada = 2,
  Pendiente = 3,
  Anulada = 4,
  Reprogramada = 5,
  Cancelada = 6,
  NoLlamar = 7
}

export enum EnumEstadoPreferenteHistorial{
  Asignado = 1,
  Reasignado = 2,
  Trabajado = 3,
  RegistroNumero = 4,
  Agendo = 5
}

export const TipoDePagoColor : any[] = [
  { id: 1, nombre: '#04a9f5' },
  { id: 2, nombre: '#1de9b6' },
  { id: 3, nombre: '#f4c22b' }
]