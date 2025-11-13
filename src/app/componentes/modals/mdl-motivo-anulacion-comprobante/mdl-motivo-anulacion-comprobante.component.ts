import {AfterViewInit, Component, Input, OnDestroy, OnInit, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {UsuarioService} from "../../../shared/services/usuario.service";
import Swal from 'sweetalert2';
import {Subscription, Observable, BehaviorSubject} from "rxjs";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {
  ComprobanteElectronicoAnulado,
  ComprobanteElectronicoReporte
} from "../../../shared/models/facturacion/comprobante-electronico";
import {ComprobanteElectronicoService} from "../../../shared/services/facturacion/comprobante-electronico.service";
import {ErrorSistema} from "../../../shared/models/error-sistema";
import {AuthService} from "../../../shared/services/auth.service";
import {ComprobanteElectronicoAnuladoService} from "../../../shared/services/facturacion/comprobante-electronico-anulado.service";

@Component({
    selector: 'app-mdl-motivo-anulacion-comprobante',
    templateUrl: 'mdl-motivo-anulacion-comprobante.component.html',
    styleUrls: ['./mdl-motivo-anulacion-comprobante.component.scss'],
})
export class MdlMotivoAnulacionComprobanteComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input() comprobante: ComprobanteElectronicoReporte;

    data: ComprobanteElectronicoAnulado | null = null;
    subscription: Subscription | undefined;


    constructor(
        private formBuilder: FormBuilder,
        private usuarioService: UsuarioService,
        private modal: NgbActiveModal,
        public  utilsService: UtilsService,
        private api: ComprobanteElectronicoAnuladoService,
        private auth: AuthService
    ) {
      this.initForm();
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void{

      this.buscarMotivo();
    }

    ngOnDestroy(): void {
    }

    initForm(): void {
    }

    /*******************************************************************************************************
     * Getters
     */


    cerrarModal( res: boolean = false ): void {
        this.modal.close(res);
    }

    /*******************************************************************************************
     * Eventos
     */
    buscarMotivo(): void{
      this.subscription = this.api.buscar(this.comprobante.id, this.auth.getUser().id).subscribe((res: ComprobanteElectronicoAnulado | ErrorSistema) => {
        if(res instanceof  ErrorSistema){
          this.utilsService.mostrarToast(res.message, 'error');
        }else{
          this.data = res;
        }
      }, (error: any) => {
        this.utilsService.mostrarToast('Ocurrio un error al intentar obtener el motivo de anulación', 'error');
      })
    }

}


