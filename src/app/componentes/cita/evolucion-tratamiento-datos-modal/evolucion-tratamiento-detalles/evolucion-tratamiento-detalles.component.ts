import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CitaDetalle} from "../../../../shared/models/cita";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {EquipoLaser} from "../../../../shared/models/equipo-laser";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ZonaCorporalService} from "../../../../shared/services/zona-corporal.service";
import {SubZona} from "../../../../shared/models/zonas";
import {UsuarioService} from "../../../../shared/services/usuario.service";
import {UtilsService} from "../../../../shared/services/funciones/utils.service";
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import {EvolucionTratamientoDosis, EvolucionTratamientoZona} from "../../../../shared/models/evolucion-tratamiento";
import {EvolucionTratamientoService} from "../../../../shared/services/evolucion-tratamiento.service";


@Component({
  selector: 'app-evolucion-tratamiento-detalles',
  templateUrl: './evolucion-tratamiento-detalles.component.html',
  styleUrls: ['./evolucion-tratamiento-detalles.component.scss']
})
export class EvolucionTratamientoDetallesComponent implements OnInit, AfterViewInit, OnDestroy {

  // Inputs
  @Input() idCita: number = 0;
  @Input() citaDetalles: CitaDetalle[] = [];
  @Input() modal: NgbModalRef;
  @Input() equiposLaser: EquipoLaser[] = [];
  @Input() collectionEvolucionTratamientoZona: EvolucionTratamientoZona[] = [];
  @Input() evolucionTratamientoZonaSeleccionada: EvolucionTratamientoZona = null;
  @Input() estado: number = 0;
  @Input() index: number = 0;



  // Collection data
  collectionDosis: EvolucionTratamientoDosis[] = [];
  collectionSubZonas: SubZona[] = [];
  fotos: string[] = [];


  // Formulario
  submitted = false;
  formGroup: FormGroup;

  // loadin
  ldObtenerFotosById = false;

  // Subscription
  sbcObtenerSubZonas: Subscription;
  sbcObtenerFotosById: Subscription;

  // data local
  evolucionTratamientoZona: EvolucionTratamientoZona = new EvolucionTratamientoZona();
  detalleSeleccionado: CitaDetalle = null;

  // fotos slider
  @ViewChild('modalFotosEvolucion') modalFotosEvolucion: any;

  constructor(
    private formBuilder: FormBuilder,
    private zonaService: ZonaCorporalService,
    private usuarioService: UsuarioService,
    private utilService: UtilsService,
    private evolucionTratamientoService: EvolucionTratamientoService,
    private modalService: NgbModal
  ) {
    this.formGroup = this.formBuilder.group({
      detalle: new FormControl('', Validators.required),
      sesion: new FormControl(0),

      fototipoPiel: new FormControl(null),
      equipoUtilizado: new FormControl(''),
      edema: new FormControl('0', Validators.required),
      eritema: new FormControl('0', Validators.required),
      dolor: new FormControl('0', Validators.required),
      agujas: new FormControl('0', Validators.required),
      quemaduras: new FormControl('0', Validators.required),
      comentario: new FormControl(''),
      comentarioCliente: new FormControl(''),
      comentarioSesion: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.iniciarValores();
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    // Destroy subscription
    if( this.sbcObtenerSubZonas ){ this.sbcObtenerSubZonas.unsubscribe(); }
    if( this.sbcObtenerFotosById ){ this.sbcObtenerFotosById.unsubscribe(); }
  }

  // modal event
  onClose( result: boolean = false ): void {
    this.modal.close(result);
  }

  // outputs
  get f(): any{
    return this.formGroup.controls;
  }
  get output(): EvolucionTratamientoZona {

    this.evolucionTratamientoZona.id = !this.estado ? 0 : this.evolucionTratamientoZonaSeleccionada.id;

    this.evolucionTratamientoZona.idEvolucionTratamiento = !this.estado ? 0 : this.evolucionTratamientoZonaSeleccionada.idEvolucionTratamiento;

    this.evolucionTratamientoZona.idCitaDetalle = parseInt(this.f.detalle.value, 10);
    this.evolucionTratamientoZona.sesion = this.f.sesion.value;
    this.evolucionTratamientoZona.fototipoPiel = this.f.fototipoPiel.value ? parseInt(this.f.fototipoPiel.value, 10) : null;

    // Equipo Utilizado
    this.evolucionTratamientoZona.equipoLaser = new EquipoLaser();
    this.evolucionTratamientoZona.equipoLaser.id = this.f.equipoUtilizado.value ? parseInt( this.f.equipoUtilizado.value ,10) : null;

    // Reacciones
    this.evolucionTratamientoZona.edema = parseInt( this.f.edema.value ,10);
    this.evolucionTratamientoZona.eritema = parseInt( this.f.eritema.value ,10);
    this.evolucionTratamientoZona.dolor = parseInt( this.f.dolor.value ,10);
    this.evolucionTratamientoZona.agujas = parseInt( this.f.agujas.value ,10)
    this.evolucionTratamientoZona.quemaduras = parseInt( this.f.quemaduras.value ,10);

    // Comentarios
    this.evolucionTratamientoZona.comentario = this.f.comentario.value;
    this.evolucionTratamientoZona.comentarioCliente = this.f.comentarioCliente.value;
    this.evolucionTratamientoZona.comentarioSesion = this.f.comentarioSesion.value;

    // Fotos
    if( this.fotos.length > 0 ){
      this.fotos.forEach((el, i) => {
        if (i === 0) {
          this.evolucionTratamientoZona.foto1 = el;
        } else {
          this.evolucionTratamientoZona.foto2 = el;
        }
      });
    }

    // fecha creación
    this.evolucionTratamientoZona.usuarioRegistro = this.usuarioService.UsuarioActual.nombre;
    this.evolucionTratamientoZona.idUsuarioRegistro = this.usuarioService.UsuarioActual.idUsuario;

    this.evolucionTratamientoZona.hasEdit = this.estado === 0 || this.estado === 1;
    // console.log(this.evolucionTratamientoZona.dosis);
    this.evolucionTratamientoZona.idEstado = 1;

    return this.evolucionTratamientoZona;

  }


  // Imagen
  onCaptureImage($event): void{
    const reader = new FileReader();
    reader.onload = event => {
      if(this.fotos.length < 2){
        //this.fotos.push(event.target.result.toString());
        this.utilService.compressImage(event.target.result.toString(), 1000, 1000).then(compressed => {
          this.fotos.push(compressed);
        });
      }
    };
    reader.readAsDataURL($event.target.files[0]);

  }
  removeImage(index: number): void{
    this.fotos.splice(index,1);
  }
  showImages(): void{
    this.modalService.open(this.modalFotosEvolucion,{
      size: 'lg',
      centered: true,
      backdrop: true,
      backdropClass: 'over'
    });
  }

  // change Events
  verDetalle( value: string ): void{
    if(value){

      this.detalleSeleccionado = this.citaDetalles.find( c => c.id === parseInt(value, 10) );

      // Mostrar el n° de sesión
      this.formGroup.patchValue({
        sesion : this.detalleSeleccionado.sesion
      });

      // Agregar zona principal
      this.evolucionTratamientoZona.dosis = [];
      const dosisZonaPadre = new EvolucionTratamientoDosis();
      dosisZonaPadre.idZona = this.detalleSeleccionado.zona.id;
      dosisZonaPadre.zona = this.detalleSeleccionado.zona.nombre;

      // Obtener subzonas
      this.obtenerSubZonas(this.detalleSeleccionado.zona.id,dosisZonaPadre);

    }else{
      this.formGroup.patchValue({
        sesion : 0
      });
    }
  }


  // Form Event
  onSubmit(): void{
    this.submitted = true;
    if(!this.formGroup.valid){
      this.utilService.mostrarToast('Datos incompletos !!', 'error', 3);
      return;
    }

    if( !this.validateHistory() ) { return; }

    if( !this.estado ){
      Swal.fire({
        title: 'Desea agregar el historial?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) {
          //console.log(this.output);
          //console.log('Evolucion tratamiento zona: ', this.output);
          this.collectionEvolucionTratamientoZona.push(this.output);
          Swal.fire({
            title: 'Se agrego el historial correctamente !!!',
            icon: 'success',
            showCancelButton: false,
            showConfirmButton: false,
            allowOutsideClick: false,
            timer: 800
          });

          this.modal.close(true);
        }
      });
    }else{
      Swal.fire({
        title: 'Desea actualizar la historia clinica?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) {
          this.collectionEvolucionTratamientoZona[this.index] = this.output;
          Swal.fire({
            title: 'Se actualizó la historia clinica correctamente !!!',
            icon: 'success',
            showCancelButton: false,
            showConfirmButton: false,
            allowOutsideClick: false,
            timer: 800
          });

          this.modal.close(true);
        }
      });
    }

  }

  // init form
  iniciarValores(): void{
    if(this.estado === 1){
      this.formGroup.patchValue({
        detalle: this.evolucionTratamientoZonaSeleccionada.idCitaDetalle,
        sesion: this.evolucionTratamientoZonaSeleccionada.sesion,

        fototipoPiel: this.evolucionTratamientoZonaSeleccionada.fototipoPiel,
        equipoUtilizado: this.evolucionTratamientoZonaSeleccionada.equipoLaser?.id,

        edema: this.evolucionTratamientoZonaSeleccionada.edema,
        eritema: this.evolucionTratamientoZonaSeleccionada.eritema,
        dolor: this.evolucionTratamientoZonaSeleccionada.dolor,
        agujas: this.evolucionTratamientoZonaSeleccionada.agujas,
        quemaduras: this.evolucionTratamientoZonaSeleccionada.quemaduras,

        comentario: this.evolucionTratamientoZonaSeleccionada.comentario,
        comentarioCliente: this.evolucionTratamientoZonaSeleccionada.comentarioCliente,
        comentarioSesion: this.evolucionTratamientoZonaSeleccionada.comentarioSesion
      });
      if( !this.evolucionTratamientoZonaSeleccionada.hasEdit )
      {
        this.obtenerFotos();
      }else{
        if( this.evolucionTratamientoZonaSeleccionada.foto1 ){ this.fotos.push(this.evolucionTratamientoZonaSeleccionada.foto1); }
        if( this.evolucionTratamientoZonaSeleccionada.foto2 ){ this.fotos.push(this.evolucionTratamientoZonaSeleccionada.foto2); }
      }
      //this.evolucionTratamientoZona.dosis = this.evolucionTratamientoZonaSeleccionada.dosis;

      // Agregar zona principal
      this.detalleSeleccionado = this.citaDetalles.find( c => c.id == parseInt(this.f.detalle.value, 10) );
      this.evolucionTratamientoZona.dosis = [];

      const dosisZonaPadre = new EvolucionTratamientoDosis();
      dosisZonaPadre.idZona = this.detalleSeleccionado.zona.id;
      dosisZonaPadre.zona = this.detalleSeleccionado.zona.nombre;

      // Obtener subzonas
      this.obtenerSubZonas(this.detalleSeleccionado.zona.id, dosisZonaPadre);

    }
  }

  updateValue( idZona: number , value: number, index: number, evt): void{
     const dosis = this.evolucionTratamientoZona.dosis.find( d => d.idZona === idZona );
     if(dosis){
       switch(value){
         case 0: this.evolucionTratamientoZona.dosis[index].valorJulios = evt.target.value; break;
         case 1: this.evolucionTratamientoZona.dosis[index].valorContinuo = evt.target.value; break;
         case 2: this.evolucionTratamientoZona.dosis[index].valorStackMovil = evt.target.value; break;
         case 3: this.evolucionTratamientoZona.dosis[index].valorStackFijo = evt.target.value; break;
         default: break;
       }
       // console.log( this.evolucionTratamientoZona.dosis );
     }
  }


  // Collapse event
  show(idElement: string ): void{
    const dataCollapse = document.getElementById(idElement).getElementsByClassName('_title')[0].getAttribute('data-collapse') !== 'false';
    document.getElementById(idElement).getElementsByClassName('_title')[0].setAttribute('data-collapse', (!dataCollapse)+'');
    document.getElementById(idElement).getElementsByClassName('_contain')[0].classList.toggle('show');
  }


  // functions

  obtenerSubZonas( idZona: number, zonaDosis: EvolucionTratamientoDosis | null = null ): void{
    // obtener las subzonas de una zona
    this.sbcObtenerSubZonas =  this.zonaService.obtenerSubZonasById( idZona ).subscribe((res: any[]) =>{

      if(!res.length){
        this.evolucionTratamientoZona.dosis.push(zonaDosis);
      }else{
        res.forEach((item) => {
          const ODosis = new EvolucionTratamientoDosis();
          ODosis.idZona = item.id;
          ODosis.zona = item.descripcion;

          this.evolucionTratamientoZona.dosis.push(ODosis);
        });
      }

      if( this.estado === 1 ){
        this.evolucionTratamientoZona.dosis.forEach( (d,i) => {
          const dosis = this.evolucionTratamientoZonaSeleccionada.dosis.find( htd => htd.idZona === d.idZona );
          if(dosis){
            this.evolucionTratamientoZona.dosis[i] = dosis;
          }
        });
      }

    },error => {
      console.log(error);
    });
  }
  hasHistory( idCitaDetalle: number ): boolean {
    // Verifica si el detalle tiene historia clinico
    if(this.estado === 1){
      return false;
    }
    return !!this.collectionEvolucionTratamientoZona.find( h => h.idCitaDetalle === idCitaDetalle && h.idEstado === 1);

  }
  validateHistory(): boolean{

    if( this.estado === 1 ){
      //return;
      // Si es edición
      const historiaEncontrada = this.collectionEvolucionTratamientoZona.find( hc => hc.idCitaDetalle === parseInt( this.f.detalle.value,10));
      if( (this.collectionEvolucionTratamientoZona[this.index].idCitaDetalle !==  parseInt( this.f.detalle.value,10)) && historiaEncontrada ){
        this.utilService.mostrarToast('Ya existe un registro con la misma zona','error');
        return false;
      }
    }

    return true;

  }
  obtenerFotos(): void{
    this.ldObtenerFotosById = true;
    this. sbcObtenerFotosById = this.evolucionTratamientoService.obtenerFotosById(this.evolucionTratamientoZonaSeleccionada.id).subscribe((res) => {
      if( res.foto1 ){ this.fotos.push(res.foto1); }
      if( res.foto2 ){ this.fotos.push(res.foto2); }
      this.ldObtenerFotosById = false;
    }, error => {
      console.log(error);
      this.ldObtenerFotosById = false;
    })
  }


}
