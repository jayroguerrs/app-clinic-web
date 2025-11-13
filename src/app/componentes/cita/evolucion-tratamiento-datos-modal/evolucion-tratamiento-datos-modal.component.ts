import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {EquipoLaserService} from "../../../shared/services/equipo-laser.service";
import { EquipoLaser } from 'src/app/shared/models/equipo-laser';
import Swal from 'sweetalert2';
import {CitaDetalle} from "../../../shared/models/cita";
import {NgxSpinnerService} from "ngx-spinner";
import {UsuarioService} from "../../../shared/services/usuario.service";
import {EvolucionTratamiento, EvolucionTratamientoZona} from "../../../shared/models/evolucion-tratamiento";
import {EvolucionTratamientoService} from "../../../shared/services/evolucion-tratamiento.service";
import {TipoPerfil} from "../../../shared/enumeracion/enums";

@Component({
  selector: 'app-evolucion-tratamiento-datos-modal',
  templateUrl: './evolucion-tratamiento-datos-modal.component.html',
  styleUrls: ['./evolucion-tratamiento-datos-modal.component.scss']
})
export class EvolucionTratamientoDatosModalComponent implements OnInit, OnDestroy {

  formGroup: FormGroup;
  ususarioLogin: string = '';

  submitted = false;
  @Input() idCita: number;
  @Input() modal: NgbModalRef;
  @Input() cita: any = null;
  @Input() evolucionTratamiento: EvolucionTratamiento;
  @Input() collectionCitaDetalle: CitaDetalle[] = [];
  @Input() edit: boolean = false;

  // Subscriptions
  sbcFormulario: Subscription;
  sbcCollectionEquipoLaser: Subscription;
  sbcCollectionCitaDetalle: Subscription;

  // Data
  collectionEquipoLaser: EquipoLaser[] = [];
  dataEvolucionTratamiento: EvolucionTratamiento;

  // Loadings
  ldCollectionEquipoLaser = false;

  // Details
  details: {
    dsubzona: string;
    valorJulios: string;
    valorContinuo: string;
    valorStackMovil: string;
    valorStackFijo: string;
  }[] = [];

  // Selects
  evolucionTratamientoZonaSeleccionada: EvolucionTratamientoZona = null;
  indexHistoriaSeleccionada: number = 0;

  // modals
  modalDetalleHistorialClinicoRef: NgbModalRef;

  /*
  * estado
  * 0 = crear
  * 1 = editar
  * 2 = ver
   */
  estado: number = 0;
  changes = false;

  // Selecionar personal que atendio
  idPerfilBuscarUsuario = TipoPerfil.TODOS.toString();
  modalUsuarioSeleccionRef: NgbModalRef;
  atendidoPor = new FormControl(null,Validators.required);
  nombreAtendidoPor = new FormControl(null,Validators.required);

  constructor(
    private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private equipoLaserService: EquipoLaserService,
    private evolucionTratamientoService: EvolucionTratamientoService,
    private spinner: NgxSpinnerService,
    private usuarioservice:UsuarioService,
    private modalService: NgbModal
  ) {
    this.ususarioLogin = this.usuarioservice.UsuarioActual.nombre;
    this.formGroup = this.formBuilder.group({
      equipoUtilizado: new FormControl('', Validators.required)
    });

  }

  ngOnInit(): void {

    if( this.evolucionTratamiento ){
      this.getData();
    }
    this.dataEvolucionTratamiento =  JSON.parse(JSON.stringify(this.evolucionTratamiento));
    this.listarEquiposLaser();
  }

  ngOnDestroy(): void {
    // Destroy subscriptions
    if( this.sbcFormulario ){ this.sbcFormulario.unsubscribe(); }
    if( this.sbcCollectionEquipoLaser ){ this.sbcCollectionEquipoLaser.unsubscribe(); }
    if( this.sbcCollectionCitaDetalle ){ this.sbcCollectionCitaDetalle.unsubscribe(); }
    // Destroy modals
    if( this.modalDetalleHistorialClinicoRef ){ this.modalDetalleHistorialClinicoRef .close(); }
  }

  onSubmit(): void{
    this.submitted = true;
    if(this.atendidoPor.invalid){
      this.utilsService.mostrarToast('Debe seleccionar el personal que atendio','warning');
      return;
    }
    if(!this.dataEvolucionTratamiento.zonas.length){
      this.utilsService.mostrarToast('Registrar minimo una historia', 'warning');
      return;
    }
    this.dataEvolucionTratamiento.idUsuarioModifico = this.usuarioservice.UsuarioActual.idUsuario;

    Swal.fire({
      title: 'Desea guardar la evolución del tratamiento?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {

        this.spinner.show();
        this.evolucionTratamientoService.grabarEvolucion( this.dataEvolucionTratamiento ).subscribe((res) => {
          this.spinner.hide();
          if(res){
            Swal.fire({
              title: 'Se guardo la evolucíon del tratamiento !!',
              icon: 'success',
              showConfirmButton: false,
              timer: 800
            });
          }else{
            this.utilsService.mostrarToast('No se puedo guardar la evolución del tratamiento!!','error');
          }
          this.modal.close(true);
        }, error => {
          this.spinner.hide();
          this.utilsService.mostrarToast('Ocurrio un error','error');
          this.modal.close(false);
        });

      }else{
        this.modal.close(false);
      }
    });

  }

  getData(): void{
    this.atendidoPor.patchValue(this.evolucionTratamiento.idUsuarioAtendio);
    this.nombreAtendidoPor.patchValue(this.evolucionTratamiento.usuarioAtendio);
  }

  onClose( result: boolean = false ): void {
    if( this.changes ){
      Swal.fire({
        text: 'Desea cerrar sin guardar los cambios?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
        allowOutsideClick: false
      }).then((result) => {
        if(result.isConfirmed){
          this.modal.close(result);
        }
      });
    }else{
      this.modal.close(result);
    }
  }

  listarEquiposLaser(): void{
    this.ldCollectionEquipoLaser = true;
    this.sbcCollectionEquipoLaser = this.equipoLaserService.collection().subscribe((res) => {
      this.collectionEquipoLaser = res;
      // console.log(this.collectionEquipoLaser);
    },error => {
      console.log(error);
    }, () => {
      this.ldCollectionEquipoLaser = false;
    });
  }

  // Events list
  removeHistory(index: number, zona: string): void{
    Swal.fire({
      html: 'Desea eliminar permanentemente la historia del tratamiento de la zona <b>'+ zona +'</b> ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataEvolucionTratamiento.zonas.map((x,i) => {
          if(i === index){
              x.idEstado = 2;
              x.hasEdit = true;
              x.idUsuarioRegistro = this.usuarioservice.UsuarioActual.idUsuario;
          }
          this.changes = true;
        });
        Swal.fire({
          html: 'Historia del tratamiento de la zona <b>'+ zona +'</b> eliminada !!',
          icon: 'success',
          showConfirmButton: false,
          timer: 800
        });
      }
    });
  }

  editHistory( modal, evolucionTratamiento: EvolucionTratamientoZona, index: number ): void{
    this.estado = 1;
    this.evolucionTratamientoZonaSeleccionada = evolucionTratamiento;
    this.indexHistoriaSeleccionada = index;

    this.modalDetalleHistorialClinicoRef = this.utilsService.abrirModal(modal,'lg');
    this.modalDetalleHistorialClinicoRef.result.then((res) => {
      if(res){
        this.changes = true;
      }
    });
  }

  addHistory( modal ): void{
    this.estado = 0;
    this.evolucionTratamientoZonaSeleccionada = null;
    this.modalDetalleHistorialClinicoRef = this.modalService.open(modal,{size:'lg', backdrop: false});
    this.modalDetalleHistorialClinicoRef.result.then((res) => {
      if(res){
        this.changes = true;
      }
    });
  }

  /*cancelHistory(index: number, zona: string): void{
    Swal.fire({
      html: 'Desea anular la evolución del tratamiento de la zona <b>'+ zona +'</b> ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataEvolucionTratamiento.zonas[index].idEstado = 0;
        this.dataEvolucionTratamiento.zonas[index].hasEdit = true;
        this.dataEvolucionTratamiento.zonas.map( (x,i) => {
          if(i === index){
            x.idEstado = 0;
            x.hasEdit = true;
          }
          return x;
        });
        this.changes = true;
        // console.log(this.dataEvolucionTratamiento.zonas);

        Swal.fire({
          html: 'Se anulo la evolución del tratamiento de la zona clinica <b>'+ zona +'</b> !!',
          icon: 'success',
          showConfirmButton: false,
          timer: 800
        });
      }
    });
  }*/

  agregarDetalleHistoriaClinica( historiaZona: any): void{
    this.dataEvolucionTratamiento.zonas.push( historiaZona );
  }

  showZone( idCitaDetalle: number ): string{
    // console.log(this.collectionCitaDetalle);
    const citaDetalle = this.collectionCitaDetalle.find( cd => cd.id === idCitaDetalle );
    if(citaDetalle){
      return citaDetalle.zona.nombre;
    }
    return '';
  }

  historiasValidas(): number{
    return this.dataEvolucionTratamiento.zonas.filter( c => c.idEstado).length;
  }


  /****
   *  Getters
   */

  get Zonas(): EvolucionTratamientoZona[] {
    return this.dataEvolucionTratamiento.zonas.filter( z => z.idEstado !== 2);
  }


  /****
   * Personal que atendio
   */
  eventUsuarioSeleccionado(event: any): void {
    this.atendidoPor.patchValue(event.idUsuario);
    this.nombreAtendidoPor.patchValue(event.nombre.trim());
    this.dataEvolucionTratamiento.idUsuarioAtendio = this.atendidoPor.value;
    //console.log('atendido por' , this.atendidoPor.value);
  }

  abrirSelecionarUsuario(modal: any): void {
    this.modalUsuarioSeleccionRef = this.utilsService.abrirModal(modal, 'md');
  }

}
