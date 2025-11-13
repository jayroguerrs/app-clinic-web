import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EditarZonaService {
  public editarZona: boolean = false; 
  public idZona: number; 
  public id: number;
  public idUsuario: number;

  public verificarHorarioZonaActivada: boolean = false;
  public pintarAgendaPorSeleccionZC: any;
  public idZonaHorarioZonaActivada: number;
  public indexZonaHorarioZonaActivada: number;
  
  constructor() { }
}
