import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { MatPaginator } from '@angular/material/paginator';
import { ControlDeCitasService } from '../../../shared/services/control-de-citas.service';
import { MatSort } from '@angular/material/sort';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { DatePipe } from '@angular/common';
import { EstadoService } from '../../../shared/services/estado.service';
import { Estado } from '../../preferente/preferente.models';
import { CitasCerradasComponent } from './citas-cerradas/citas-cerradas.component';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { Usuario } from '../../../shared/models';
import { UsuarioService } from '../../../shared/services/usuario.service';
import Swal from 'sweetalert2';
import { ColorEstadoCita, ColorTipoCita } from '../../../shared/enumeracion/enums';
import { ExportarService } from '../../../shared/services/exportar.service';

interface ZonaNode{
  abonado: boolean;
  celular: string;
  clienteNuevo: string;
  estado: string;
  fechaCita: string;
  id: number;
  idCita: number;
  idCliente: number;
  idPreferente: number;
  idServicio: number;
  medioDeContacto: string;
  nombreSede: string;
  paciente: string;
  pagoFinal?: number;
  precioDePagoFinal?: number;
  total?: number;
  tachado?: boolean;
  children?: ZonaNode[];
  notificado: boolean;
  idSede: number;
  tipoCita: string;
  idTipoCita: number;
  estadoCliente: string;
  usuarioRegistra: string;
}
interface ExampleInterfaceDos{
  expandable: boolean;
  level: number;
  abonado: boolean;
  celular: string;
  clienteNuevo: string;
  estado: string;
  fechaCita: string;
  id: number;
  idCita: number;
  idCliente: number;
  idPreferente: number;
  idServicio: number;
  medioDeContacto: string;
  nombreSede: string;
  paciente: string;
  pagoFinal: number;
  precioDePagoFinal: number;
  total: number;
  tachado?: boolean;
  notificado: boolean;
  idSede: number;
  tipoCita: string;
  idTipoCita: number;
  estadoCliente: string;
  usuarioRegistra: string;
}
@Component({
  selector: 'app-control-de-citas',
  templateUrl: './control-de-citas.component.html',
  styleUrls: ['./control-de-citas.component.scss']
})
export class ControlDeCitasComponent implements OnInit, AfterViewInit  {
  public palabraBusqueda : string;
  public fechaFiltro: any;
  public fechaFiltroFinal: any;
  private busqueda: boolean = false;
  public totalControlDecitas: number = 0;
  public pagina: number= 1;
  public rowsPerPage: number = 10;
  public fechaInicio : any
  public fechaFin : string
  usuarioActual: Usuario;

  citaEstados: Estado[] = [];
  estadoSeleccionado?: any;

  elementos_por_pagina: number = 10;
  idUsuario: any;

  private transformer = (node: ZonaNode, level: number) => {
      return {
        expandable: !!node.children && node.children.length > 0,
        level: level,
  
        abonado: node.abonado ,
        celular : node.celular,
        clienteNuevo : node.clienteNuevo,
        estado : node.estado,
        fechaCita : node.fechaCita,
        id : node.id,
        idCita : node.idCita,
        idCliente : node.idCliente,
        idPreferente : node.idPreferente,
        idServicio : node.idServicio,
        medioDeContacto : node.medioDeContacto,
        nombreSede : node.nombreSede,
        paciente : node.paciente,
        pagoFinal : node.pagoFinal,
        precioDePagoFinal : node.precioDePagoFinal,
        total : node.total,
        children: node.children,
        tachado: node.tachado,
        notificado: node.notificado,
        idSede: node.idSede,
        tipoCita: node.tipoCita,
        idTipoCita: node.idTipoCita,
        estadoCliente: node.estadoCliente,
        usuarioRegistra: node.usuarioRegistra
      };
    }
  
    treeControl = new FlatTreeControl<ExampleInterfaceDos>(
      node => node.level, node => node.expandable);
  
    treeFlattener = new MatTreeFlattener(
        this.transformer, node => node.level, 
        node => node.expandable, node => node.children);
  
    dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    ocultarAnulados: boolean = false;

  constructor(
    private spinner: NgxSpinnerService,
    private controlDeCitasService: ControlDeCitasService,
    private localStorageService: LocalStorageService,
    private datePipe: DatePipe,
    private estadoService: EstadoService,
    private usuarioService: UsuarioService,
    private exportarService: ExportarService,
  ) { }

  hasChild = (_: number, node: ExampleInterfaceDos) => node.expandable;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(CitasCerradasComponent) citasCerradas: CitasCerradasComponent;

  nuevaNotificacion: boolean = true;
  ngOnInit(): void {
    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.idUsuario = this.localStorageService.getUser()?.id ;
    if(this.usuarioActual.idperfil === 8){
      this.configurarFechaSupervisor();
    }
    
    this.obtenerControlDeCitas();
    this.obtenerEstados();
  }

  configurarFechaSupervisor(){
      const fechaHoy = new Date();
      this.fechaFin = this.datePipe.transform(fechaHoy, 'yyyy-MM-dd') || "";
      
      const fecha31DiasAtras = new Date();
      fecha31DiasAtras.setDate(fechaHoy.getDate() - 1);
      this.fechaInicio = this.datePipe.transform(fecha31DiasAtras, 'yyyy-MM-dd') || "";
      
      this.fechaFiltro = fecha31DiasAtras;
      this.fechaFiltroFinal = fechaHoy;
  }

  displayedColumnsControl: string[] = ['notificar', 'idCita', 'nombre', 'celular', 'sede', 'nuevo', 'origen', 'monto', 'fecha_de_cita', 'estado', 'pago_final', 'agendado_por'];


  dataSourceControl = new MatTableDataSource<any>([]);

  ngAfterViewInit() {
      this.dataSourceControl.paginator = this.paginator;
  }

  applyFilterBusqueda(filterValue: string): void {

    if(!filterValue){
      this.palabraBusqueda = "";
      this.pagina = 1;
      this.paginator.pageIndex = 0;
      this.obtenerControlDeCitas();
      this.dataSourceControl.filter = this.palabraBusqueda.trim().toLowerCase();
    }
  }


  obtenerControlDeCitas(){
    this.spinner.show();

    if(this.usuarioActual.idperfil === 8){
      this.idUsuario = 0;
    }

    this.controlDeCitasService.getCitasByUser(this.idUsuario, this.pagina, this.rowsPerPage, this.fechaInicio, this.fechaFin, this.palabraBusqueda, "", this.estadoSeleccionado, null, null, this.ocultarAnulados).subscribe((resp: any) => {
      this.dataSourceControl = new MatTableDataSource<any>(resp.citas);
      this.dataSource.data = resp.citas;
      this.totalControlDecitas = resp.total;

      this.dataSourceControl.sort = this.sort;
      this.spinner.hide();
    })
  }

  enviarNotificacion(idSede: number, idcita: number, index: number){
    Swal.fire({
      title: "¿Estas seguro de notificar el pago?",
      
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, notifícalo!",
      cancelButtonText: "No, Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.controlDeCitasService.enviarNotificaionDePago(this.usuarioActual.idUsuario, idSede, this.usuarioActual.nombre, idcita).subscribe((resp : any) => {
          if(resp.status == 201){
            this.dataSource.data[index].notificado = true;
            this.dataSource.data = [...this.dataSource.data]; 

            Swal.fire({ 
              title: 'Notificación enviada',
              icon: 'success',
              buttonsStyling: false,
              timer: 1500,
              showCancelButton: false,
              showConfirmButton: false,
            })
          }
        });
      }
    });

  }

  listarBotonFuncion(){
    this.limpiarFiltroBusqueda();
    this.citasCerradas.limpiarLocalStorageCitas();
    this.citasCerradas.limpiarFiltroBusqueda();
  }

  //filtro de busqueda boton
  applyFilterButton(): void {
    this.pagina = 1;
    this.paginator.pageIndex = 0;
    this.obtenerControlDeCitas();
    this.dataSourceControl.filter = this.palabraBusqueda.trim().toLowerCase();
  }

  limpiarFiltroBusqueda(){
    this.pagina = 1;
    this.paginator.pageIndex = 0;
    this.palabraBusqueda = "";
    this.fechaFiltro = null;
    this.fechaInicio = null;
    this.fechaFiltroFinal = null;
    this.fechaFin = "";
    this.estadoSeleccionado = "";
    this.obtenerControlDeCitas();
  }

  consultarPorEstado(event: any){
    this.pagina = 1;
    this.paginator.pageIndex = 0;
    this.obtenerControlDeCitas();
  }
  
  mostrarControlDeCitaFechaIncio(){
    this.pagina = 1;
    this.paginator.pageIndex = 0;
    this.fechaInicio = this.datePipe.transform(this.fechaFiltro, 'yyyy-MM-dd') || "";
    this.obtenerControlDeCitas();
  }

  mostrarControlDeCitaFechaFinal(){
    if(this.fechaInicio){
      this.pagina = 1;
      this.paginator.pageIndex = 0;
      this.fechaFin = this.datePipe.transform(this.fechaFiltroFinal, 'yyyy-MM-dd') || "";
      this.obtenerControlDeCitas();
    }
  }


  onPageChange(event: any) { 
    
    if(event.pageSize !== this.rowsPerPage) {
      this.pagina = 1;
      this.paginator.pageIndex = 0;
    } else{
      this.pagina = event.pageIndex + 1;
    }
    this.rowsPerPage = event.pageSize;

    this.obtenerControlDeCitas();
    if(!this.busqueda){
      // *this.obtenerControlDeCitas();
    } else {
      // *this.buscarControlDeCitas();
    }
  }
  
  buscarControlDeCitas(){

  }

  obtenerEstados(): void {
    this.estadoService.obtenerEstadoByEntidad('cita').subscribe((res: Estado[]) => {
        this.citaEstados = res;
    }, error => {

    })
  }

  mostrarCitaDetalle(element: any){
    const url = `/Cita/${element.idCita}/${1}/${element.idCliente}/${element.idPreferente}/${element.idServicio}`;
    window.open(url, '_blank');
  }

  mostrarClienteDetalle(id: number){
    const url = `/ClientePerfil/${id}`;
    window.open(url, '_blank');
  }

  getColorPorEstadoDeCita(estado: string){
    const color = ColorEstadoCita.find(c => c.nombre === estado);
    return color ? color.value : '#252525';
  }

  getColorPorServicioDeCita(idTipoCita: number){
    const color = ColorTipoCita.find(c => c.idTipoCita === idTipoCita);
    return color ? color.value : '#252525';
  }

  onCheckboxChangeOcultarAnulados(event: any){
    this.pagina = 1;
    this.paginator.pageIndex = 0;
    const isChecked = (event.target as HTMLInputElement).checked;
    this.ocultarAnulados = isChecked;

    this.obtenerControlDeCitas();
  }

  exportarExcel(){
    this.spinner.show();
    this.controlDeCitasService.getCitasByUserExcel(this.idUsuario, this.fechaInicio, this.fechaFin, this.ocultarAnulados, this.estadoSeleccionado).subscribe((resp: any) => {
      const dataSourceExcel = new MatTableDataSource<any>(resp);

      const datosExportar = dataSourceExcel.data.map((item: any) => ({
        'ID Cita': item.idCita,
        'Paciente': item.paciente,
        'Celular': item.celular,
        'Sede': item.nombreSede,
        'Nuevo': item.clienteNuevo,
        'Origen': item.medioDeContacto,
        'Monto Acordado': item.total ? `S/. ${item.total.toFixed(2)}` : 'S/. 0.00',
        'Pago Final': item.precioDePagoFinal != null ? `S/. ${item.precioDePagoFinal.toFixed(2)}` : '',
        'Fecha de Cita': item.fechaCita,
        'Estado de Cita': item.estado,
        'Estado Cliente': item.estadoCliente,
        'Agendado Por': item.usuarioRegistra
      }))

      this.exportarService.exportToExcel(datosExportar, 'Control_de_Citas');
      this.spinner.hide();
    })
  }
}

