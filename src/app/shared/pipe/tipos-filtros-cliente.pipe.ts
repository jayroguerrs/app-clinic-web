import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tiposFiltrosCliente'
})
export class TiposFiltrosClientePipe implements PipeTransform {

  transform(id: number, tipo: string, tipos:any []): unknown {
    if (id === null || id === undefined || !tipos) {
      return 'No encontrado';
    }

    let nombreTipo: any = {};

    switch (tipo) {
      case 'tipoSede':
        nombreTipo = tipos.find(t => t.id === id);
        return nombreTipo ? nombreTipo.nombre : 'Sede no encontrada';
      case 'tipoCliente':
        nombreTipo = tipos.find(t => t.idTipoCliente === id);
        return nombreTipo ? nombreTipo.tipoCliente : 'Cliente no encontrado';
      case 'tipoCita':
        nombreTipo = tipos.find(t => t.id === id);
        return nombreTipo ? nombreTipo.nombre : 'Tipo de Cita no encontrada';
      case 'estadoCita':
        nombreTipo = tipos.find(t => t.id === id);
        return nombreTipo ? nombreTipo.descripcion : 'Estado no encontrado';
      case 'tipoServicio':
        nombreTipo = tipos.find(t => t.id === id);
        return nombreTipo.nombre === "Servicio de Depilación" ? 'Depilación' : nombreTipo ? nombreTipo.nombre : 'Servicio no encontrado';
      default:
        return 'No encontrado';
    }

    

  }

}