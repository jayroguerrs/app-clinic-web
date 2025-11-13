import {AfterViewInit, Component, Input, OnDestroy, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UsuarioService} from "../../../shared/services/usuario.service";
import {Subscription, Observable, BehaviorSubject} from "rxjs";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {AuthService} from "../../../shared/services/auth.service";
import {PreferenteService} from "../../../shared/services/preferente.service";

import Swal from 'sweetalert2';
import {ErrorSistema} from "../../../shared/models/error-sistema";
import {PreferenteObservacion} from "../../../shared/models/preferente.model";
import {PreferenteObservacionComponent} from "../../widgets/preferente-observacion/preferente-observacion.component";

@Component({
    selector: 'app-mdl-preferente-reasignar',
    templateUrl: 'mdl-preferente-reasignar.component.html',
    styleUrls: ['./mdl-preferente-reasignar.component.scss'],
})
export class MdlPreferenteReasignarComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('observacion') cmpObservacion: PreferenteObservacionComponent;
    @Input() idPreferente: number;
    @Output() OnUpdated: EventEmitter<boolean> = new EventEmitter<boolean>();

    formGroup: FormGroup | undefined;

    // Emitir Comprobante
    submitted: boolean;
    sbcSubmit: Subscription | undefined;
    ldSubmit: boolean;

    preferente: any;
    ldPreferente: boolean;



    usuarios: any[];
    ldUsuarios: boolean;
    subscriptions: Subscription[] = [];

    observaciones: PreferenteObservacion[] = [];
    sbcObservaciones: Subscription | undefined;

    constructor(
        private formBuilder: FormBuilder,
        private usuarioService: UsuarioService,
        private modal: NgbActiveModal,
        public  utilsService: UtilsService,
        private auth: AuthService,
        private preferenteService: PreferenteService
    ) {
      this.initForm();
      this.ldUsuarios = false;
      this.ldPreferente = false;
    }

    ngOnInit(): void {
      this.ldSubmit = false;
      this.submitted = false;

      this.obtenerDatosPreferente(this.idPreferente);
      this.obtenerUsuarios();
    }

    ngAfterViewInit(): void{
      // console.log(this.idPreferente);
      this.sbcObservaciones = this.cmpObservacion._collection.subscribe((res: PreferenteObservacion[]) => {
        this.observaciones = res;
      });
    }

    ngOnDestroy(): void {
      this.sbcSubmit?.unsubscribe();
      this.subscriptions.forEach(s => s.unsubscribe());
      this.sbcObservaciones.unsubscribe();
    }

    initForm(): void {
      this.formGroup = this.formBuilder.group({
        idUsuario: new FormControl(null),
      });
    }

    /*******************************************************************************************************
     * Getters
     */
    get f(): any { return this.formGroup.controls; }

    get model(): any {
        return {
          idUsuario: this.f.idUsuario.value
        }
    }

    get loading(): Observable<boolean>{
      const obs = new BehaviorSubject<boolean>(false);
      obs.next( this.ldSubmit || this.ldUsuarios );

      return obs;
    }


    cerrarModal( res: boolean = false ): void {
        this.modal.close(res);
    }

    /*******************************************************************************************
     * Eventos
     */
    evtLimpiarObservacion(): void{
      this.cmpObservacion.clear();
    }

    evtOnSubmit(): void {
      this.submitted = true;

      if (this.formGroup.invalid) {
        this.utilsService.mostrarToast('Debe seleccionar un operador!!!', 'info');
        this.ldSubmit = false;
        return;
      }


      Swal.fire({
        html: `Desea reasignar el preferente <br><b class="fs-20px">${this.preferente.nombres} ${ this.preferente.apellidos}</b> ??`,
        icon: 'question',
        allowOutsideClick: false,
        allowEscapeKey: false,
        buttonsStyling: false,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        showCancelButton: true,
        customClass: {
          confirmButton: 'btn sbtn btn-primary btn-active-primary popins',
          cancelButton: 'btn sbtn btn-light popins mr-2',
        },
        reverseButtons: true
      }).then(
        (result) => {
          if(result.isConfirmed) {
            this.ldSubmit = true;
            const subs = this.preferenteService.preferenteReasignar({
              idUsuario: this.auth.getUser().id,
              idPreferente: this.preferente.id,
              asignadoA: this.f.idUsuario.value,
              observaciones: this.observaciones
            }).subscribe((res: boolean | ErrorSistema)=> {

                if (res instanceof ErrorSistema){

                  // console.log(res);

                  Swal.fire({
                    title: 'Error',
                    text: res.message,
                    icon: 'error',
                    buttonsStyling: false,
                    confirmButtonText: 'Aceptar',
                    customClass: {
                      confirmButton: 'btn sbtn btn-primary btn-active-primary popins'
                    }
                  });

                  this.ldSubmit = false;
                }else{
                  Swal.fire({
                    html: `Se reasigno al preferente  <b>${this.preferente.nombres} ${this.preferente.apellidos}</b> con exito!!!`,
                    icon: "success",
                    buttonsStyling: false,
                    confirmButtonText: "Aceptar",
                    customClass: {
                      confirmButton: "btn sbtn btn-primary btn-active-primary popins"
                    }
                  });
                  this.ldSubmit = false;
                  this.OnUpdated.emit(true);
                  this.cerrarModal(true);
                }

              },
              error => {
                Swal.fire({
                  title: 'Error',
                  html: `Error al intentar asignar el preferente <b>${this.preferente.nombres}-${this.preferente.apellidos}</b>`,
                  icon: 'error',
                  buttonsStyling: false,
                  confirmButtonText: 'Aceptar',
                  customClass: {
                    confirmButton: 'btn sbtn btn-primary btn-active-primary popins'
                  }
                });
                console.log('Error al reasignar al preferente', error);
                this.ldSubmit = false;
              });
            this.subscriptions.push(subs);
          }else{
            this.cerrarModal();
          }
        }
      );


    }


  /*******************************************************************************************
   * Data
   */
  obtenerUsuarios(): void{
    this.ldUsuarios = true;
    const subs = this.usuarioService.obtenerUsuarios(true).subscribe((res) => {
      this.usuarios = res;
      this.ldUsuarios = false;
    }, error => {
      this.utilsService.mostrarToast('Ocurrio un error al obtener los usuarios', 'error');
      console.log(error);
      this.ldUsuarios = false;
    });
    this.subscriptions.push(subs);
  }


  obtenerDatosPreferente(idPreferente: number): void{
    this.ldPreferente = true;
    const subs = this.preferenteService.preferenteObtenerPorId(idPreferente, this.auth.getUser().id).subscribe((res) => {
      this.preferente = res;
      this.ldPreferente = false;
    }, error => {
      this.utilsService.mostrarToast('Ocurrio un error al obtener los datos del preferente', 'error');
      console.log(error);
      this.ldPreferente = false;
    });
    this.subscriptions.push(subs);
  }


}


