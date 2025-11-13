import { Component, OnInit, ViewChild, Inject, HostListener, Output, EventEmitter } from '@angular/core';
import { ControlDeCitasService } from '../../../../shared/services/control-de-citas.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { CcvoxService } from '../../../../shared/services/ccvox.service';
import { ClienteBusquedaCitaService } from '../../../../shared/services/cliente-busqueda-cita.service';

@Component({
  selector: 'app-busqueda-numero',
  templateUrl: './busqueda-numero.component.html',
  styleUrls: ['./busqueda-numero.component.scss', '../busqueda-cliente/busqueda-cliente.component.scss', '../../../cita/control-de-citas/citas-cerradas/citas-cerradas.component.scss', '../../../cita/control-de-citas/control-de-citas.component.scss']
})
export class BusquedaNumeroComponent implements OnInit {
  numeroCliente: string = '';
  idCita: string = '';

  mostrarScannerCita: boolean = false;
  mostrarScannerCliente: boolean = false;

  qrResultString: string;
  
  @Output() citaEncontrada = new EventEmitter<number>();
  @Output() quitarCita = new EventEmitter<boolean>();
  @Output() quitarTablaGlobal = new EventEmitter<boolean>();
  constructor(

    public dialog: MatDialog,
    private ccVoxService: CcvoxService,
    private clienteBusquedaCitaService: ClienteBusquedaCitaService,
  ) {}

  ngOnInit(): void {

    
  }

  limpiarFiltroBusqueda(){
    this.numeroCliente = '';
  }

  limpiarFiltroBusquedaIdCita(){
    this.mostrarScannerCita = false;
    this.mostrarScannerCliente = false;
    this.idCita = '';
    this.quitarCita.emit(true);
  }

  buscarSiEsCliente(event: KeyboardEvent | any){
    if(event){
      if(event.keyCode === 13) {
        this.esCliente();
      }
    }

    if(event === 'boton'){
      this.esCliente();
    }
  }

  buscarCita(event: KeyboardEvent | any){
    if(event){
      if(event.keyCode === 13) {
        this.buscarCitaPorIdCita();
      }
    }
  }

  esCliente(){
    const regex = /^\d+$/;
    let numeroSinEspacios = this.numeroCliente.replace(/\s+/g, '');

    if (!regex.test(numeroSinEspacios)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No ingrese texto'
      });

      return;
    }
    if(numeroSinEspacios.length < 1 || numeroSinEspacios.length > 12){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ingrese un formato de numero adecuado'
      });

      return;
    }
    this.ccVoxService.esCliente(numeroSinEspacios).subscribe((res) => {
      window.location.href = res.redirect;
      });
    
  }

    windowWidth: number = window.innerWidth;
    isSmallScreen: boolean = this.windowWidth <= 1193;
  
    @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
      this.windowWidth = window.innerWidth;
      this.isSmallScreen = this.windowWidth <= 1193;
    }

    buscarCitaPorIdCita(){
      const regex = /^\d+$/;
      let idCita = this.idCita.replace(/\s+/g, '');
  
      if (!regex.test(idCita)) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No ingrese texto'
        });
  
        return;
      }

      this.citaEncontrada.emit(Number(idCita));
      this.quitarTablaGlobal.emit(true);

      this.mostrarScannerCita = false;
      this.mostrarScannerCliente = false;
    }

    mostrarScannerCitaF(){
      this.quitarCita.emit(true);
      this.idCita= '';
      this.mostrarScannerCliente = false;
      this.mostrarScannerCita = !this.mostrarScannerCita;
    }

    mostrarScannerClienteF(){
      this.quitarCita.emit(true);
      this.idCita= '';
      this.mostrarScannerCita = false;
      this.mostrarScannerCliente = !this.mostrarScannerCliente;
    }

    onCodeResultCita(resultString: string) {
      this.idCita = resultString;
      this.buscarCitaPorIdCita();
    }

    onCodeResultCliente(resultString: string) {
      this.numeroCliente = resultString;
      this.buscarSiEsCliente('boton');
    }

}
