import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { fakeData, sedes, listadoClientes } from '../../../assets/mock-data/box'
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoxService {

  constructor(private http: HttpClient) { }

  getPlanta(idSede: number, piso: number) {
    const plantaFiltrada = fakeData.find(item => 
      item.idSede === idSede && item.piso === piso
    );
  
    return of(plantaFiltrada || null);
    // return of(fakeData);
    // return this.http.get('assets/planta-data.json');
  }

  getSedes() {
    return of(sedes);
    // return this.http.get('assets/planta-data.json');
  }

  getListadoDeEspera(idSede: number, piso: number){
    const listadoEsperaFiltrado = listadoClientes.find(item => 
      item.idSede === idSede && item.piso === piso
    );

    return of(listadoEsperaFiltrado || null);
  }

  scannearCodigoBox(){
    const usuarioQR = {
      idServicio: 1,
      idSede: 1,
      idCliente: 105,
    }

    // Envia el Objeto al backend y ahi se fija si hay un box libre y disponible en 
    // base al servicio y la sede y emite un socket para listar la lista de espera

  }
}
