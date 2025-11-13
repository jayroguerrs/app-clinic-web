import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pip_tipodepago'
})
export class TipodepagoPipe implements PipeTransform {

  transform(value: number): unknown {
    const sinPago ='Sin Pago';

    if (value === null || value === undefined) {
      return sinPago;
    }

    const tipoComprobante = tiposDePago.find(t => t.id === Number(value));
    return tipoComprobante ? tipoComprobante.nombre : sinPago;
  }

}


const tiposDePago = [
  { id: 1, nombre: 'Adelanto' },
  { id: 2, nombre: 'Pago Total' },
  { id: 3, nombre: 'Pagará en Sede' }
]