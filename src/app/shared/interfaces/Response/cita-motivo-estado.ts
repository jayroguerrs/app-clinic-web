export interface RCitaMotivoEstado{
   id: number;
    idCita: number;
   idMotivo: number;
   fechaRegistro: Date;
   usuarioRegistro: string;
   fechaModifico: Date | null;
   usuarioModifico: string | null;
}

export interface RCitaMotivo{
  id: number;
  motivo: string;
  idCitaEstado: number;
}

export interface RCitaMotivoGeneral{
  idCita: number;
  cliente: string;
  idCliente: number;
  //sede: string;
  idSede: number;
  genero: string;
  estado: string;
  idEstado: number;
  estadoColor: string;
  motivo: string;
  fechaRegistro: Date;
  usuarioRegistro: string;
}

export const CitaEstadoColor =[
  {idEstado: 5, color: '#04a9f5'},
  {idEstado: 6, color: '#1de9b6'},
  {idEstado: 7, color: '#28a745'},
  {idEstado: 8, color: '#343a40'},
  {idEstado: 9, color: '#dc3545'},
  {idEstado: 10, color: '#ffc107'},
  {idEstado: 30, color: '#b734f8'},
]

