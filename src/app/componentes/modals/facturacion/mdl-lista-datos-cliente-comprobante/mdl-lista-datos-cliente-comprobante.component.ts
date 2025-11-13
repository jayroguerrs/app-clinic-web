import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';

import Swal from 'sweetalert2';
import {UsuarioService} from "../../../../shared/services/usuario.service";
import {UtilsService} from "../../../../shared/services/funciones/utils.service";
import {DatePipe} from "@angular/common";
import {FacturaTipoDocumento} from "../../../../shared/models/facturacion/factura-tipo-documento";
import {Subscription} from "rxjs";
import {FacturaTipoDocumentoService} from "../../../../shared/services/facturacion/factura-tipo-documento.service";
import {ErrorSistema} from "../../../../shared/models/error-sistema";
import {FacturaDatosCliente} from "../../../../shared/models/facturacion/factura-datos-cliente";
import {FacturaDatosClienteService} from "../../../../shared/services/facturacion/factura-datos-cliente.service";
import {AuthService} from "../../../../shared/services/auth.service";
import {EnumFacturaTipoDocumento} from "../../../../shared/enumeracion/enums";

@Component({
    selector: 'app-mdl-lista-datos-cliente-comprobante',
    templateUrl: 'mdl-lista-datos-cliente-comprobante.component.html',
    styleUrls: ['./mdl-lista-datos-cliente-comprobante.component.scss'],
})
export class MdlListaDatosClienteComprobanteComponent implements OnInit, AfterViewInit, OnDestroy {

    @Output() OnUpdated: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() OnSelected: EventEmitter<FacturaDatosCliente> = new EventEmitter<FacturaDatosCliente>();

    formGroup: FormGroup;
    submitted: boolean;

    // Buscar datos del cliente por documento
    ldBuscarCliente: boolean;
    sbcBuscarCliente: Subscription | undefined;


    collection: FacturaDatosCliente[] = [];
    selected: FacturaDatosCliente | null = null;

    enumFacturaTipoDocumento = EnumFacturaTipoDocumento;

    constructor(
        private auth: AuthService,
        private formBuilder: FormBuilder,
        private usuarioService: UsuarioService,
        private modal: NgbActiveModal,
        public utilsService: UtilsService,
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private api: FacturaDatosClienteService,
        private facturaTipoDocumentoService: FacturaTipoDocumentoService
    ) {
      this.ldBuscarCliente = false;
      this.submitted = false;

      this.initForm();
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void{
    }

    ngOnDestroy(): void {
      this.sbcBuscarCliente?.unsubscribe();
    }

    initForm(): void {
      this.formGroup = this.formBuilder.group({
        numeroDocumentoCliente: new FormControl(null, Validators.required)
      })
    }

    patchForm(data: FacturaDatosCliente): void{
      // console.log(this.data);
      this.formGroup.patchValue({
        idClienteDato: data.id ? data.id : null,
      });
    }

    get f(): any { return this.formGroup.controls; }

    cerrarModal( res: boolean = false ): void {
        this.modal.close(res);
    }



    /****************************************************************************************************************
     * Events
     */
    evtBuscarCliente(): void{
      this.submitted = true;
      if(this.formGroup.invalid){
        this.utilsService.mostrarToast('Falta ingresar el número del documento', 'warning');
        return;
      }

      console.log('e');

      this.sbcBuscarCliente?.unsubscribe();
      this.collection = [];
      this.selected = null;
      this.ldBuscarCliente = true;
      this.sbcBuscarCliente = this.api.buscarByNumeroDocumento(this.f.numeroDocumentoCliente.value, this.auth.getUser().id).subscribe((res: FacturaDatosCliente | ErrorSistema) => {
        console.log(res);

        if(res instanceof ErrorSistema){
          this.utilsService.mostrarToast(res.message, 'error');
        }else{
          this.collection.push(res);
        }
        this.ldBuscarCliente = false;
      }, error => {
        this.utilsService.mostrarToast('Ocurrio un error al intentar buscar los datos del cliente', 'error');
        console.log(error);
        this.ldBuscarCliente = false;
      });

      console.log(this.f.numeroDocumentoCliente.value);
    }

    evtSelect(model: FacturaDatosCliente): void{
      this.selected = model;
    }

    evtSeleccionar(): void{
      this.OnSelected.emit(this.selected);
      this.cerrarModal();
    }

}
