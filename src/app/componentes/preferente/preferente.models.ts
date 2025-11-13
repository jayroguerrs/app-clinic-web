import { NULL_EXPR } from "@angular/compiler/src/output/output_ast";

export class MaestroPreferente {
    comentarios: Comentario[];
    teleoperadores: Teleoperador[];
    mediosContactos: MedioContacto[];
    zonasCorporales: ZonaCorporal[];
    departamentos: Departamento[];
    estado: Estado[];
    estadoAtencion: Estado[];
  }

export class Comentario {
    id: number;
    descripcion: string;
  }

export class Teleoperador{
    idUsuario: number;
    nombre: string;
  }

export class MedioContacto{
    id: number;
    nombre: string;
  }

export class ZonaCorporal{
    idZona: number;
    descripcion: string;
  }

export class Departamento{
    idDepartamento: string;
    departamento: string;
  }

export class Estado{
    id: number;
    descripcion: string;
  }

export class Preferente{
    id: number;
    nombres: string;
    apellidos: string;
    email: string;
    idUbicacion: string;
    distrito: string;
    provincia: string;
    departamento: string;
    direccion: string;
    idTeleoperador: number;
    idComentario: number;
    comentario: string;
    idMedioContacto: number;
    idMedioContactoCierre: number | null;    
    idEstado: number;
    idEstadoAtencion: number;
    usuFacebook: string | null;
    usuInstagram: string | null;
    otroMedioContacto: string;
    observacion: string;
    promocion: string;    
    fechaAsignacion: Date;
    usuarioRegistra: string;
    fechaRegistra: Date;
    usuarioEdita: string;
    fechaEdita: Date;
    preferenteTelefono: PreferenteTelefono[];
    preferenteZonaCorporal: PreferenteZonaCorporal[];
    preferenteObservacion: PreferenteObservacion[];
    esCliente: number;
    idCliente: number;

    clienteNombre: string;
    clienteApellido: string;
    clienteCorreo: string;
    clienteTelefono: string;
    clienteTelefonoPais: string;

    idAtencionCategoria: number;
    idAtencionOpcion: number;

    telefono: string;



    idPreferenteAtencion: number;
    estadoPreferenteAtencion: string;
    fechaPreferenteAtencion: Date | null;

    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
    utmId: string;
    utmTerm: string;
    codAtencion: string;

    constructor() {
    }
  }

export class PreferenteTelefono{
    id: number;
    idPreferente: number;
    numero: string;
    prefijop: string;
  }

export class PreferenteZonaCorporal{
    id: number;
    idPreferente: number;
    idZonaCorporal: number;
    descripcion: string;
  }

export class PreferenteObservacion{
    id: number;
    idPreferente: number;
    observacion: string;
  }





