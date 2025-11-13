import {AfterViewInit, Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges} from '@angular/core';

import Swal from "sweetalert2";
import {BoxWeek} from "../../../shared/models/box";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {CronogramaSemana, CitaDetalle} from "../../../shared/models/corporal-360/Cita";
import {Tecnologia} from "../../../shared/models/tecnologia";
import {User} from "../../../corporal360/shared/model/usuario";
import {UsuarioService} from "../../../shared/services/usuario.service";
import {TecnologiaService} from "../../../shared/services/tecnologia.service";
import {PromocionZonaService} from "../../../shared/services/promocionZona.services";
import {PromocionZona} from "../../../shared/models/promocion";
import {UsuarioSeleccionComponent} from "../../usuario/usuario-seleccion/usuario-seleccion.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../../shared/services/auth.service";

@Component({
  selector: 'app-tbl-cita-detalle-corporal360',
  templateUrl: './tbl-cita-detalle-corporal360.component.html',
  styleUrls: ['./tbl-cita-detalle-corporal360.component.scss']
})
export class TblCitaDetalleCorporal360Component implements OnInit, OnDestroy, AfterViewInit, OnChanges  {

  @Input() Detalles: CitaDetalle[] = [];
  @Input() Tecnologias: Tecnologia[] = [];
  @Input() IdServicio: number = 0;


  /****************/
  weeks: BoxWeek[][] = [];
  semanas: CronogramaSemana[] = [];

  collection: CitaDetalle[] = [];
  tecnologias: Tecnologia[] = [];
  usuarios: User[] = [];


  // loading
  ldUsuarios = false;
  ldTecnologias = false;

  private submitted = false;


  constructor(
    private utilService: UtilsService,
    private usuarioService: UsuarioService,
    private tecnologiaService: TecnologiaService,
    private promocionZonaService: PromocionZonaService,
    private modalService: NgbModal,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.collection = [...this.Detalles]
    this.obtenerUsuarios();
    this.obtenerTecnologias();
    this.obtenerPromociones();
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnDestroy(): void {

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
        x.promocionZona = res;
        x.loadingPromocionZona = false;
      }, error => {
        x.loadingPromocionZona = false;
      });
    });
  }

  // collection
  changeTecnologia(index: number, event: any): void{
    const detalle = this.collection.find((x,i) => i === index);
    detalle.idTecnologia = event.target.value ? parseInt(event.target.value, 10) : 0;
    detalle.tecnologia = event.target.value ? this.Tecnologias.find(x => x.id === parseInt(event.target.value, 10)).nombre : null;
    detalle.tecnologiaNombreCorto = event.target.value ? this.Tecnologias.find(x => x.id === parseInt(event.target.value, 10)).nombreCorto : null;
    // console.log(this.Detalles);
  }
  changeSesion(index: number, event: any): void{
    this.collection.find((x,i) => i === index).sesion = parseInt(event.target.value, 10)
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
  selectUser(data: CitaDetalle): void{
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
    return true;
  }

  // setter
  setSubmitted(e: boolean): void{
    this.submitted = e;
  }
  setCollection(citaDetalles: CitaDetalle[]): void{
    this.collection = citaDetalles;
    this.obtenerPromociones();
  }



}
