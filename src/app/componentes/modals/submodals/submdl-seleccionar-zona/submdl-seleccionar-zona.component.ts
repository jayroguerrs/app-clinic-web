import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CitaDetalle} from "../../../../shared/models/corporal-360/Cita";
import {GroupButtonComponent} from "../../../group-button/group-button.component";
import {AuthService} from "../../../../shared/services/auth.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Servicio} from "../../../../shared/models/servicio";
import {TecnologiaService} from "../../../../shared/services/tecnologia.service";
import {Tecnologia} from "../../../../shared/models/tecnologia";
import {Subscription} from "rxjs";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {UtilsService} from "../../../../shared/services/funciones/utils.service";
import Swal from "sweetalert2";
import {ErrorSistema} from "../../../../shared/models/error-sistema";
import { ServicioService } from 'src/app/shared/services/corporal360/servicio.service';
import { ZonaCorporalService } from '../../../../shared/services/zona-corporal.service';
import { PromocionZonaService } from '../../../../shared/services/promocionZona.services';
import { UsuarioService } from '../../../../shared/services/usuario.service';
import { Usuario } from '../../../../shared/models';

@Component({
  selector: 'app-submdl-seleccionar-zona',
  templateUrl: './submdl-seleccionar-zona.component.html',
  styleUrls: ['./submdl-seleccionar-zona.component.scss', '../submdl-seleccionar-tecnologias/submdl-seleccionar-tecnologias.component.scss']
})
export class SubmdlSeleccionarZonaComponent implements OnInit {
  @Input() Servicio: Servicio | null = null;
  @Input() IdServicio: number = 0;

  maestroZonasCorporales: any;
  maestroZonasCorporalesFiltrados: any[] = [];

  @Output() onZonaSeleccionada = new EventEmitter<any>();


  /////////////////////
  @Input() zonasDetalle: any[] = [];


  idServicio: FormControl;
  zonasSelected: any[] = [];

  servicios: Servicio[] = [];

  servicio: Servicio | null = null;
  ldServicio = false;
  sbServicio: Subscription;



  // form
  submitted = false;

  filtroZonas: string = '';
  promocionesPorZonas: any[] = [];
  usuarioActual: Usuario
  
  constructor(
    public bsModalRef: NgbActiveModal,
    private servicioService: ServicioService,
    private util: UtilsService,
    private zonaService: ZonaCorporalService,
    private promocionZonaService: PromocionZonaService,
    private usuarioService: UsuarioService,
  ) {
    this.idServicio = new FormControl('', Validators.required);
  }

  ngOnInit(): void {
    this.obtenerServicio();
    this.obtenerDatosDeZonas();

    this.usuarioActual = this.usuarioService.UsuarioActual;
  }

  obtenerDatosDeZonas(){
    this.zonaService.obtenerListadoPorServicio(this.IdServicio).subscribe(res => {
      this.maestroZonasCorporales = res;

      // const zonasSeleccionadasSet = new Set(this.zonasDetalle.map(z => z.idZona));
      const zonasSeleccionadasSet = new Set(
        this.zonasDetalle
          .filter(z => z.estado === true)
          .map(z => z.idZona)
      );
  
      this.maestroZonasCorporales = this.maestroZonasCorporales.filter(zona => 
        !zonasSeleccionadasSet.has(zona.id)
      );
  
      this.maestroZonasCorporalesFiltrados = [...this.maestroZonasCorporales];
    })
  }

  ngAfterViewInit(): void {

    if(this.IdServicio){
      this.idServicio.patchValue(this.IdServicio);
    }
  }

  ngOnDestroy(): void {
    this.bsModalRef?.close();
  }

  onClose(): void {
    this.bsModalRef.close();
  }

  filtrarZonas(){
    const texto = this.filtroZonas.toLowerCase().trim();
    const idsSeleccionados = this.zonasSelected.map(z => z.id);

    this.maestroZonasCorporalesFiltrados = this.maestroZonasCorporales
    .filter(z => 
      !idsSeleccionados.includes(z.id) && 
      z.descripcion.toLowerCase().includes(texto)
    );

  }

  // Data
  obtenerServicio(): void{
    this.ldServicio = true;
    this.sbServicio = this.servicioService.buscarById(this.IdServicio).subscribe((res: Servicio | ErrorSistema) => {
      if(res instanceof ErrorSistema){
        this.util.mostrarToast(res.message,'error');
      }else{
        this.servicio = res;
      }
      this.ldServicio = false;
    }, error => {
      console.log(error);
      this.util.mostrarToast('Ocurrio un error al intentar obtener el servicio','error');
      this.ldServicio = false;
    })
  }

  // Functions
  drop(event: CdkDragDrop<Tecnologia[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      event.previousContainer.data.find((x, i) => i == event.previousIndex).minutos = 10;
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      console.log(event.container.data);
    }
  }
  dropSeleccionadas(event: CdkDragDrop<Tecnologia[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
  enviarZonasSeleccionadas(){
    const idsZonasCorporales = this.zonasSelected.map(t => t.id).join(',');

    const subs = this.promocionZonaService.obtenerByZonasCorporales(idsZonasCorporales). subscribe((res: any) => {
      this.promocionesPorZonas = res;

      this.zonasSelected.forEach( (zonaCorporal, index) => {
        zonaCorporal.promociones = this.promocionesPorZonas.filter( p =>  p.idZona == zonaCorporal.id);
        zonaCorporal.duplicado = false;
        zonaCorporal.duracion = 0;
        zonaCorporal.estado = true;
        zonaCorporal.idZona = zonaCorporal.id;
        zonaCorporal.id = 0;
        zonaCorporal.idMedioContactoOrigen = 0;
        zonaCorporal.idPromocion = 0;
        zonaCorporal.idPromocionPrecio = 0;
        zonaCorporal.idUsuarioAgendado = this.usuarioActual.idUsuario;
        zonaCorporal.idUsuarioAgendadoStr = this.usuarioActual.idUsuario.toString();
        zonaCorporal.pagoWeb = false;
        zonaCorporal.peso = 1;
        zonaCorporal.precio = 0;
        zonaCorporal.retroTratam = false;
        zonaCorporal.usuarioAgendado = this.usuarioActual.nombre;
        zonaCorporal.creadoEnAtencion = true;
      });

      this.onZonaSeleccionada.emit(this.zonasSelected);
      this.onClose();
    })

  }
}
