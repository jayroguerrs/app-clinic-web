import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pip_tipoComprobante'
})
export class TipoComprobantePipe implements PipeTransform {

  transform(value: string, isMobile: boolean = false): unknown {
    const sinPago = isMobile ? 'Sin Pago' : 'Sin<br>Pago';

    if (value === null || value === undefined) {
      return sinPago;
    }

    const tipoComprobante = tiposComprobantes.find(t => t.id === Number(value));
    return tipoComprobante ? tipoComprobante.nombre : sinPago;
  }

}

const tiposComprobantes = [
  { id: 1, nombre: 'Factura' },
  { id: 2, nombre: 'Ticket' },
  { id: 3, nombre: 'Boleta' }
]