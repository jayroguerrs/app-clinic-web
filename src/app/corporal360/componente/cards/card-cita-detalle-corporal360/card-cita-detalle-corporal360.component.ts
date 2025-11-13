import {AfterViewInit, Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges} from '@angular/core';

import Swal from "sweetalert2";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CitaDetalle, CronogramaSemana} from "../../../../shared/models/corporal-360/Cita";
import {Tecnologia} from "../../../../shared/models/tecnologia";
import {BoxWeek} from "../../../../shared/models/box";
import {User} from "../../../shared/model/usuario";
import {UtilsService} from "../../../../shared/services/funciones/utils.service";
import {UsuarioService} from "../../../../shared/services/usuario.service";
import {TecnologiaService} from "../../../../shared/services/tecnologia.service";
import {PromocionZonaService} from "../../../../shared/services/promocionZona.services";
import {AuthService} from "../../../../shared/services/auth.service";
import {PromocionZona} from "../../../../shared/models/promocion";
import {UsuarioSeleccionComponent} from "../../../../componentes/usuario/usuario-seleccion/usuario-seleccion.component";
import {ParametrosCronograma} from "../../../../shared/models/corporal-360/Parametros";
import {CitaDetalle360Service} from "../../../../shared/services/corporal360/cita-detalle360.service";
import {AccionCita} from "../../../../shared/enumeracion/enums";
import {CurrencyMaskInputMode} from "ngx-currency";
import {animate, AUTO_STYLE, state, style, transition, trigger} from "@angular/animations";
import {detalle} from "../../../../shared/models/detalle";
import {MedioContactoService} from "../../../../shared/services/medio-contacto.service";
import {MedioContacto} from "../../../../componentes/preferente/preferente.models";
import {Subscription} from "rxjs";

const DEFAULT_DURATION = 300;

@Component({
  selector: 'app-card-cita-detalle-corporal360',
  templateUrl: './card-cita-detalle-corporal360.component.html',
  styleUrls: ['./card-cita-detalle-corporal360.component.scss'],
  animations: [
    trigger('collapse', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-in')),
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-out'))
    ])
  ]
})
export class CardCitaDetalleCorporal360Component implements OnInit, OnDestroy, AfterViewInit, OnChanges{

  options = { prefix: 'S/ ', thousands: '', decimal: '.', inputMode: CurrencyMaskInputMode.NATURAL }

  parametros: ParametrosCronograma = new ParametrosCronograma();
  @Input() Tecnologias: Tecnologia[] = [];
  @Input() IdServicio: number = 0;
  @Input() IdCita: number = 0;


  @Input() set Detalles(detalles: CitaDetalle[]){
    this.setCollection(detalles);
  };
  @Input() set Parametros(val: ParametrosCronograma) {
    this.parametros = {...val};
  }

  /****************/
  weeks: BoxWeek[][] = [];
  semanas: CronogramaSemana[] = [];


  collection: CitaDetalle[] = [];
  tecnologias: Tecnologia[] = [];
  usuarios: User[] = [];

  medioContacto: MedioContacto[] = [];
  sbMedioContacto: Subscription | undefined;


  // loading
  ldUsuarios = false;
  ldTecnologias = false;
  ldDetalles = false;
  ldMedioContacto = false;

  public submitted = false;

  accionCita = AccionCita;

  collapsed = false;
  constructor(
    private utilService: UtilsService,
    private usuarioService: UsuarioService,
    private tecnologiaService: TecnologiaService,
    private promocionZonaService: PromocionZonaService,
    private modalService: NgbModal,
    private authService: AuthService,
    private citaDetalleService: CitaDetalle360Service,
    private medioContactoService: MedioContactoService
  ) {
  }

  ngOnInit(): void {
    if(this.IdCita){
      this.obtenerDetalles();
      this.obtenerUsuarios();
    }
    this.obtenerMedioContactos();
  }

  ngAfterViewInit(): void {
    //  // console.log('detalles', this.Detalles);
    // // this.collection = [...this.Detalles]
    // this.obtenerUsuarios();
    // this.obtenerTecnologias();
    // // this.obtenerPromociones();
    // if(!this.Detalles.length){
    //   this.obtenerDetalles();
    // }
  }

  ngOnDestroy(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('parametroActualizado - ', changes);
  }

  // data
  obtenerUsuarios(): void{
    this.ldUsuarios = true;
    this.usuarioService.collectionByEstado(1).subscribe((res: User[]) => {
      this.usuarios = res;
      this.ldUsuarios = false;
    }, error => {
      console.log(error);
      this.ldUsuarios = false;
    });
  }
  obtenerTecnologias(): void{
    this.ldTecnologias = true;
    this.tecnologiaService.listarByServicio(this.IdServicio).subscribe((res: Tecnologia[]) => {
      this.tecnologias = res;
    }, error => {
      console.log(error);
    })
  }
  obtenerPromociones(): void{
    this.collection.forEach(x => {
      x.loadingPromocionZona = true;
      this.promocionZonaService.listarByZona(x.idZona).subscribe((res: PromocionZona[]) => {
        // console.log('promociones', res);
        x.promocionZona = res;
        x.loadingPromocionZona = false;
      }, error => {
        x.loadingPromocionZona = false;
      });
    });
  }

  obtenerDetalles(): void{
    if(!this.IdCita){return;}
    this.ldDetalles = true;
    this.citaDetalleService.findByCita(this.IdCita).subscribe((res: CitaDetalle[]) => {
      // console.log('detalles obtenidos',res);
      let col: CitaDetalle[] = res;
      if( [this.accionCita.VER, this.accionCita.ATENDER].includes(this.parametros.citaAccionActual) ){
        col = col.map(x => {x.collapsed = true; return x});
      }
      this.setCollection(col);
      this.ldDetalles = false;
    }, error => {
      console.log(error);
      this.ldDetalles = false;
    })
  }

  obtenerMedioContactos(): void{
    this.ldMedioContacto = true;
    this.sbMedioContacto = this.medioContactoService.obtenerMedioContacto().subscribe((res: MedioContacto[]) => {
      this.medioContacto = res;
      this.ldMedioContacto = false;
    }, error => {
      console.log(error);
      this.ldMedioContacto = false;
    })
  }

  // collection
  changeTecnologia(index: number, event: any): void{
    const detalle = this.collection.find((x,i) => i === index);
    detalle.idTecnologia = event.target.value ? parseInt(event.target.value, 10) : 0;
    detalle.tecnologia = event.target.value ? this.Tecnologias.find(x => x.id === parseInt(event.target.value, 10)).nombre : null;
    detalle.tecnologiaNombreCorto = event.target.value ? this.Tecnologias.find(x => x.id === parseInt(event.target.value, 10)).nombreCorto : null;
    // console.log(this.Detalles);
  }
  changePrecio(index: number, event: any): void{
    // console.log(this.collection);
    // this.collection.find((x,i) => i === index).precio = event.target.value ? parseFloat(event.target.value) : 0;
  }
  changeSesion(index: number, event: any): void{
    const sesion = parseInt(event.target.value, 10);
    const model = this.collection.find((x,i) => i === index);
    model.sesion = sesion;
    if(sesion > 1){
      model.idMedioContactoOrigen = 0;
      model.idUsuarioAgendado = null;
    }
    if(sesion === 1){
      model.idUsuarioAgendado = this.authService.getUser().id;
      model.usuarioAgendado = this.authService.getUser().name;
    }
    // console.log(this.Detalles);
  }
  changeMinutos(index: number, event: any): void{
    this.collection.find((x,i) => i === index).minutos = parseInt(event.target.value, 10);
    // console.log(this.Detalles);
  }
  changePromocion(index: number, event: any): void{
    this.collection.find((x,i) => i === index).idPromocionPrecio = event.target.value ? parseInt(event.target.value, 10) : 0;
    // console.log(this.Detalles);
  }
  changeUsuarioAgendado(index: number, event: any): void{
    this.collection.find((x,i) => i === index).idUsuarioAgendado = event.target.value ? parseInt(event.target.value, 10) : 0;
    // console.log(this.Detalles);
  }
  changeOrigen(index: number, event: any): void{
    this.collection.find((x,i) => i === index).idMedioContactoOrigen = parseInt(event.target.value, 10);
    // console.log(this.Detalles);
  }

  nombreMedioOrigen(id: number): string{
    return this.medioContacto.find(x => x.id === id)?.nombre;
  }


  selectUser(data: CitaDetalle): void{
    if(this.parametros.citaAccionActual === this.accionCita.VER){return;}
    const modal = this.modalService.open(UsuarioSeleccionComponent,{size:'md'});
    modal.componentInstance.idPerfil = this.usuarioService.UsuarioActual.idperfil;
    modal.componentInstance.modal = modal;
    modal.componentInstance.eventUsuarioSeleccionado.subscribe((res:any) => {
      data.idUsuarioAgendado = res.idUsuario;
      data.usuarioAgendado = res.nombre.trim();
    });
  }


  // validacion
  validar(): boolean{
    if(this.collection.filter(x => !x.idTecnologia).length){
      this.utilService.mostrarToast('Tiene pendiente el tipo de tecnología a seleccionar', 'warning');
      return false;
    }
    if(this.collection.filter(x => !x.idPromocionPrecio).length){
      this.utilService.mostrarToast('Tiene pendiente la promoción a seleccionar', 'warning');
      return false;
    }
    if(this.collection.filter(x => x.sesion === 1 && !x.idUsuarioAgendado).length){
      this.utilService.mostrarToast('Tiene pendiente el usuario asignado a seleccionar', 'warning');
      return false;
    }
    if(this.collection.filter(x => x.sesion === 1 && !x.idMedioContactoOrigen).length){
      this.utilService.mostrarToast('Tiene pendiente el origen a seleccionar', 'warning');
      return false;
    }
    return true;
  }

  // setter
  setSubmitted(e: boolean): void{
    this.submitted = e;
  }
  async setCollection(citaDetalles: CitaDetalle[]): Promise<void>{

    console.log('nuevo detalle del horario', citaDetalles );

    const detalleNuevo: CitaDetalle[] = await citaDetalles.filter(x => !(this.collection.map(y => y.idZona).includes(x.idZona) && this.collection.map(y => y.idTecnologia).includes(x.idTecnologia)) );
    const detalleExistente: CitaDetalle[] = await this.collection.filter(x => citaDetalles.map(y => y.idZona).includes(x.idZona) && citaDetalles.map(y => y.idTecnologia).includes(x.idTecnologia) );



    if(this.collection.length) {
      await this.collection.forEach(x => {
        citaDetalles.forEach(y => {
          if(x.idZona === y.idZona && x.idTecnologia === y.idTecnologia){
            x.minutos = y.minutos;
          }
        })
      });
      this.collection = await this.collection.concat(detalleNuevo);
    }else{
      this.collection = citaDetalles;
    }

    // this.collection = await this.collection.concat(detalleNuevo);
    // console.log(this.collection)

    this.obtenerPromociones();
  }


  // collapse
  toggle(index: number) {
    this.collection.forEach((x, i) => {
      if(i === index) { x.collapsed = !x.collapsed }
    });
    // this.collapsed = !this.collapsed;
  }


}
