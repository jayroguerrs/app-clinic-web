import { Injectable } from '@angular/core';
import { ClienteImportClass } from '../models/cliente';
import { CitaImportClass } from '../models/cita';

@Injectable({
  providedIn: 'root'
})
export class ImportExportDataService {
  private _clienteClass: ClienteImportClass = null;
  private _citaImportClass: CitaImportClass = null;
  private _citaConsultar: any = null;
  private _preferenteCliente: any = null;

  private _fechaFitro_ListadoCita: Date = new Date();
  ClienteExport(clienteClass: ClienteImportClass): boolean {
    this._clienteClass = clienteClass;
    return true;
  }
  ClienteImport(): ClienteImportClass{
    return this._clienteClass;
  }

  CitaExport(citaImportClass: CitaImportClass): boolean {
    this._citaImportClass = citaImportClass;
    return true;
  }
  CitaImport(): CitaImportClass{
    return this._citaImportClass;
  }

  ConsultaCitaImport(): any {
    return this._citaConsultar;
  }
  ConsultarCitaExport(citaConsultar: any): boolean {
    this._citaConsultar = citaConsultar;
    return true;
  }

  GetFechaFiltro_ListadoCita(): Date {
    return this._fechaFitro_ListadoCita;
  }
  SetFechaFiltro_ListadoCita(fecha: Date) {
    this._fechaFitro_ListadoCita = fecha
  }

  preferenteClienteExport(preferenteCliente) {
    this._preferenteCliente = preferenteCliente;
  }
  preferenteClienteImport(): any {
    return this._preferenteCliente;
  }

}
