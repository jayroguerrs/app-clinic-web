export interface VentaFormDTO {
    idTeleoperadora: number;
    docCliente: string;
    nombreCliente: string;    
    fechaCita: string;  
    idTipoCliente: number;
    idOrigen: number;
    idServiciosPorPromocion: number;
    idPromociones: number;
    idSede: number;
    nroOrigen: string;
    observaciones?: string; 
    idUsuario: number;
}
