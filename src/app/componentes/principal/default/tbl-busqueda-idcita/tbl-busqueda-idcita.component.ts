import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ClienteBusquedaCitaService } from '../../../../shared/services/cliente-busqueda-cita.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ColorEstadoCita, ColorServicioCita } from '../../../../shared/enumeracion/enums';
import { ActivatedRoute, Router } from '@angular/router';
import { PermisosService } from '../../../../shared/services/permisos.service';
import { UsuarioService } from '../../../../shared/services/usuario.service';
import { Usuario } from '../../../../shared/models/usuario';
import { RSede } from '../../../../shared/interfaces/Response/sede';
import { CitaService } from '../../../../shared/services/cita.service';
import { SedeService } from '../../../../shared/services/sede.service';
import { CitaTipoService } from '../../../../shared/services/cita-tipo.service';
import { EstadoService } from '../../../../shared/services/estado.service';
import { ServicioService } from '../../../../shared/services/servicio.service';
import { Estado } from '../../../preferente/preferente.models';
import { Servicio } from '../../../../shared/models/servicio';
import { NgxSpinnerService } from 'ngx-spinner';
import { PagoFinalDialog } from '../../../cita/cita-registro/cita-registro.component';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { ControlDeCitasService } from '../../../../shared/services/control-de-citas.service';

@Component({
  selector: 'app-tbl-busqueda-idcita',
  templateUrl: './tbl-busqueda-idcita.component.html',
  styleUrls: ['./tbl-busqueda-idcita.component.scss', '../../../cita/control-de-citas/control-de-citas.component.scss', '../../../cita/control-de-citas/citas-cerradas/citas-cerradas.component.scss', '../../../cliente/cliente-perfil-datosgenerales/citas-cliente-perfil/citas-cliente-perfil.component.scss'],
})
export class TblBusquedaIdcitaComponent implements OnInit {
  @Input() idCita: number = 0;
  pageIndex: number = 0; 
  pageSize: number = 5;
  usuarioActual: Usuario;

  collectionSede: RSede[] = [];
  listadoTipoCliente = [];
  idClienteElegido: number;
  listadoTipoCita: any = [];
  citaEstados: Estado[] = [];
  listaServicios: Servicio[] = [];
  
  nombreCliente: string = '';
  celularClient: string = '';
  displayedColumnsControlCitas: string[] = ['carta', 'id_cita', 'fecha_de_cita', 'resumen', 'id_servicio', 'id_estado', 'id_tipo_cita', 'id_tipo_cliente', 'total', 'pago_final'];
  dataSourceControl = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  

  windowWidth: number = window.innerWidth;
  isSmallScreen: boolean = this.windowWidth <= 1193;

  selectedRow: any = null;
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.windowWidth = window.innerWidth;
    this.isSmallScreen = this.windowWidth <= 1193;
  }
  
  @Output() citaSeleccionada = new EventEmitter<number>();
  @Output() limpiarFiltroBusquedaIdCitaO = new EventEmitter<boolean>();
  constructor(
    private clienteBusquedaCitaService: ClienteBusquedaCitaService,
    private router: Router,
    private permisoService: PermisosService,
    private usuarioService: UsuarioService,

    private sedeService: SedeService,
    private citaService: CitaService,
    private tiposCitaService: CitaTipoService,
    private estadoService: EstadoService,
    private servicioService: ServicioService,

    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private controlDeCitasService: ControlDeCitasService,    
  ) { }

  ngOnInit(): void {

    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.obtenerCitaPorIdCita();
    this.obtenerDatos();
  }

  obtenerDatos(){
    this.obtenerSedes();
    this.obtenerTipDeCliente();
    this.obtenerTiposCita();
    this.obtenerEstados();
    this.listarServicios();
  }


  obtenerSedes(): void{
    // this.loadingSede = true;
    this.sedeService.obtener().subscribe((res: any[]) => {

      const collection: RSede[] = [];
      res.forEach((el) => {
        const sede: RSede = {
          id: el.idSede,
          nombre: el.nombre
        };
        collection.push(sede);
      });

      this.collectionSede = collection;


    }, error => {
    }, () => {
      // this.loadingSede = false;
    });
  }

  obtenerTipDeCliente(){

    this.citaService.obtenerDatosPreliminares().subscribe(
      resultado => {
        this.listadoTipoCliente = resultado.clienteTipos;
      },
      error => {
        console.log('Error al obtener los datos preliminares', error);
      }
    );
  }
  obtenerEstados(): void {

    this.estadoService.obtenerEstadoByEntidad('cita').subscribe((res: Estado[]) => {
      this.citaEstados = res;
    })

  }

  obtenerTiposCita(): void{

    this.tiposCitaService.collection().subscribe((res) => {
      this.listadoTipoCita = res;
    }, error => {
    });
  }
  listarServicios(): void{

    this.servicioService.listarByEstado(1).subscribe((x: Servicio[]) => {
      this.listaServicios = x;
      

    }, error => {
    })
  }

  obtenerCitaPorIdCita(){

    this.spinner.show();

    this.clienteBusquedaCitaService.obtenerCitaPorIdcita(this.idCita).subscribe((res: any) => {
      this.dataSourceControl = new MatTableDataSource<any>(res.citas);
      this.dataSourceControl.paginator = this.paginator;

      this.nombreCliente = res.citas[0].nombreCliente;
      this.celularClient = res.citas[0].celularCliente;
      this.spinner.hide();
    }, (error) => {
      this.spinner.hide();
      console.error(error);
    });
  }

  enviarCitaSeleccionada(row: any){
    this.selectedRow = row;
    this.citaSeleccionada.emit(row);
  }

  getColorPorEstadoDeCita(idEstado: number){
    const color = ColorEstadoCita.find(c => c.index === idEstado);
    return color ? color.value : '#252525';
  }

  getColorPorServicioDeCita(idServicio: number){
    const color = ColorServicioCita.find(c => c.idServicio === idServicio);
    return color ? color.value : '#252525';
  }
  
  mostrarCitaDetalle(element: any){
    if (this.isSmallScreen) {
      this.router.navigate([
        '/Cita',
        element.idCita,
        1,
        element.idCliente,
        element.idPreferente,
        element.idServicio
      ]);
    } else{
      const url = `/Cita/${element.idCita}/${1}/${element.idCliente}/${element.idPreferente}/${element.idServicio}`;
      window.open(url, '_blank');

    }
  }

  onPageChanged(event: any): void {
    this.pageIndex = event.pageIndex;
  }

  isPerfilAutorizado(): boolean {
    return this.permisoService.isAutorizado(this.usuarioActual.idperfil);
  }

  verPerfilCliente(){
    const idCliente = this.dataSourceControl.data[0].idCliente;
    if (this.isSmallScreen) {
      this.router.navigate([
        '/ClientePerfil',
        idCliente
      ]);
    } else{
      const url = `/ClientePerfil/${idCliente}`;
      window.open(url, '_blank');
    }
  }


  cambiarEstadoPagoFinal(idCita: number, result: any): void {
    const idCitaACambiar = this.dataSourceControl.data.findIndex((x: any) => x.idCita === idCita);
    // this.dataSourceControl.data[idCitaACambiar].idEstado = 7;
    this.dataSourceControl.data[idCitaACambiar].precioDePagoFinal = Number(result.montoFinal);;
    this.dataSourceControl.data[idCitaACambiar].idTipoPago = result.tipoDePago;
    this.dataSourceControl.data[idCitaACambiar].colorTipoPago = result.color;
  }

  openModalConfirm(idCita: number, precioNeto: number, precioDePagoFinal: any, tipoPago: number | null = null): void {

    this.controlDeCitasService.abrirMdlTipoDePago(idCita, this.nombreCliente, precioDePagoFinal != null ? precioDePagoFinal : precioNeto, tipoPago, precioDePagoFinal)
    .subscribe(result => {
      if (result) {
         this.controlDeCitasService
          .updatePayment(idCita, result.montoFinal, this.usuarioActual.idUsuario, result.tipoDePago)
          .subscribe((res: any) => {
            if (res.status !== 200) return;

            this.cambiarEstadoPagoFinal(idCita, result);
            this.controlDeCitasService.mostrarSuccesPaymentToast(false);
          })
      }
    })
  }

  limpiarFiltroBusquedaIdCita(){
    this.limpiarFiltroBusquedaIdCitaO.emit(true);
  }
}
