import {AfterViewInit, Component, Input, OnDestroy, OnInit, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {UsuarioService} from "../../../shared/services/usuario.service";
import Swal from 'sweetalert2';
import {Subscription, Observable, BehaviorSubject} from "rxjs";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {
  ComprobanteElectronicoReporte
} from "../../../shared/models/facturacion/comprobante-electronico";
import {ComprobanteElectronicoService} from "../../../shared/services/facturacion/comprobante-electronico.service";
import {ErrorSistema} from "../../../shared/models/error-sistema";
import {AuthService} from "../../../shared/services/auth.service";

@Component({
    selector: 'app-mdl-anular-comprobante',
    templateUrl: 'mdl-anular-comprobante.component.html',
    styleUrls: ['./mdl-anular-comprobante.component.scss'],
})
export class MdlAnularComprobanteComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input() data: ComprobanteElectronicoReporte;
    @Output() OnCreated: EventEmitter<boolean> = new EventEmitter<boolean>();

    formGroup: FormGroup | undefined;

    // Emitir Comprobante
    submitted: boolean;
    sbcSubmit: Subscription | undefined;
    ldSubmit: boolean;

    modalRef: NgbModalRef | undefined



    constructor(
        private formBuilder: FormBuilder,
        private usuarioService: UsuarioService,
        private modal: NgbActiveModal,
        public  utilsService: UtilsService,
        private api: ComprobanteElectronicoService,
        private auth: AuthService
    ) {
      this.initForm();
    }

    ngOnInit(): void {
      this.ldSubmit = false;
      this.submitted = false;
    }

    ngAfterViewInit(): void{
      console.log(this.data);
    }

    ngOnDestroy(): void {
      this.modalRef?.close();
      this.sbcSubmit?.unsubscribe();
    }

    initForm(): void {
      this.formGroup = this.formBuilder.group({
        motivo: new FormControl(''),
      });
    }

    /*******************************************************************************************************
     * Getters
     */
    get f(): any { return this.formGroup.controls; }

    get model(): any {
        return {
          motivo: this.f.motivo.value
        }
    }

    get loading(): Observable<boolean>{
      const obs = new BehaviorSubject<boolean>(false);
      obs.next( this.ldSubmit );

      return obs;
    }


    cerrarModal( res: boolean = false ): void {
        this.modal.close(res);
    }

    /*******************************************************************************************
     * Eventos
     */
    evtOnSubmit(): void {
      this.submitted = true;

      if (this.formGroup.invalid) {
        this.utilsService.mostrarToast('Datos incompletos!!!', 'info');
        this.ldSubmit = false;
        return;
      }


      Swal.fire({
        html: `Desea anular el comprobante <br><b class="fs-20px">${this.data.tipoComprobante}</b> <br><b>${this.data?.serie}-${this.data?.numero}</b>??`,
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
        result => {
          if(result.isConfirmed) {
            this.ldSubmit = true;
            this.api.anular({
              idUsuario: this.auth.getUser().id,
              idSede: this.data.idSede,
              idVenta: this.data.id,
              idTipoComprobante: this.data.idTipoComprobante,
              serie: this.data.serie,
              numero: this.data.numero,
              motivo: this.f.motivo.value
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
                    html: `Se creo la solicitud de anulación para el comprobante  <b>${this.data?.tipoComprobante} ${this.data?.serie}-${this.data?.numero}</b> con exito!!!`,
                    icon: "success",
                    buttonsStyling: false,
                    confirmButtonText: "Aceptar",
                    customClass: {
                      confirmButton: "btn sbtn btn-primary btn-active-primary popins"
                    }
                  });
                  this.ldSubmit = false;
                  this.OnCreated.emit(true);
                  this.cerrarModal(true);
                }

              },
              error => {
                Swal.fire({
                  title: 'Error',
                  html: `Error al intentar anular el comprobante <b>${this.data?.serie}-${this.data?.numero}</b>`,
                  icon: 'error',
                  buttonsStyling: false,
                  confirmButtonText: 'Aceptar',
                  customClass: {
                    confirmButton: 'btn sbtn btn-primary btn-active-primary popins'
                  }
                });
                console.log('Error al modificar de la plantilla', error);
                this.ldSubmit = false;
              });
          }else{
            this.cerrarModal();
          }
        }
      );


    }

}


