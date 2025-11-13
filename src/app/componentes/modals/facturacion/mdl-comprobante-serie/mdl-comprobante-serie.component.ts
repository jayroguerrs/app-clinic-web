import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

import {Subscription} from "rxjs";
import {Usuario} from "../../../../shared/models";
import {UsuarioService} from "../../../../shared/services/usuario.service";
import {UtilsService} from "../../../../shared/services/funciones/utils.service";
import {ErrorSistema} from "../../../../shared/models/error-sistema";
import {ComprobanteSerie} from "../../../../shared/models/facturacion/comprobante-serie";
import {ComprobanteSerieService} from "../../../../shared/services/facturacion/comprobante-serie.service";
import {TipoComprobante} from "../../../../shared/models/tipo-comprobante";
import {SedeService} from "../../../../shared/services/sede.service";
import {TipoComprobanteService} from "../../../../shared/services/tipo-comprobante.service";
import {Sede} from "../../../../shared/models/sede";

@Component({
    selector: 'app-mdl-comprobante-serie',
    templateUrl: 'mdl-comprobante-serie.component.html'
})
export class MdlComprobanteSerieComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input() data: ComprobanteSerie | null = null;
    @Output() OnCreated: EventEmitter<any> = new EventEmitter();
    @Output() OnUpdated: EventEmitter<any> = new EventEmitter();

    frmGroup: FormGroup;
    usuarioActual: Usuario;

    ldSubmit = false;
    submitted = false;
    subscription : Subscription;

    ldPatch = false;

    // data sedes
    ldSedes = false;
    sbcSede: Subscription | undefined;
    sedes: Sede[] = [];
    // data tipos de comprobante
    ldTiposComprobante = false;
    sbcTiposComprobante: Subscription | undefined;
    tiposComprobante: TipoComprobante[] = [];



    estados: {id: number; value: string}[] = [
      {id: 0, value: 'INACTIVO'},
      {id: 1, value: 'ACTIVO'}
    ];

    constructor(
        private formBuilder: FormBuilder,
        private usuarioService: UsuarioService,
        private api: ComprobanteSerieService,
        private utilsService: UtilsService,
        private modal: NgbActiveModal,
        private sedeService: SedeService,
        private tiposComprobanteService: TipoComprobanteService
    ) {

    }

    ngOnInit(): void {
        this.usuarioActual = this.usuarioService.UsuarioActual;
        this.initForm();
        if( this.data) {
          this.patchForm();
        }
    }

    ngAfterViewInit(): void {
      this.obtenerSedes();
      this.obtenerTiposComprobante();
    }

    ngOnDestroy(): void {
      this.subscription?.unsubscribe();
    }

    /************************************************************************************************
     * Getters
     */
    get loading(): boolean{
      return this.ldTiposComprobante ||
              this.ldSedes ||
              this.ldPatch ||
              this.ldSedes;
    }
    get f(): any { return this.frmGroup.controls; }
    get model(): any {
      return {
        id: this.data ? this.data.id : 0,
        idSede: parseInt(this.f.idSede.value, 10),
        idTipoComprobante: parseInt(this.f.idTipoComprobante.value, 10),
        serie: this.f.serie.value,
        descripcion: this.f.descripcion.value,
        idEstado: parseInt(this.f.idEstado.value, 10),
        numeroActual: parseInt(this.f.numeroActual.value, 10),
        idUsuarioRegistro: this.data ? this.data.idUsuarioRegistro : this.usuarioActual.idUsuario,
        idUsuarioModifico: this.data ? this.usuarioActual.idUsuario : null,
      };
    }



    initForm(): void {
        this.frmGroup = this.formBuilder.group({
          idSede : new FormControl('', Validators.required),
          idTipoComprobante : new FormControl('', Validators.required),
          serie : new FormControl(null, [Validators.maxLength(10)]),
          descripcion : new FormControl(null, [Validators.maxLength(150)]),
          numeroActual : new FormControl(0, [Validators.required, Validators.min(1)]),
          idEstado : new FormControl(1, Validators.required)
        });
    }

    patchForm(): void{
      this.frmGroup.patchValue({
        idSede: this.data.idSede,
        idTipoComprobante: this.data.idTipoComprobante,
        serie: this.data.serie,
        descripcion: this.data.descripcion,
        numeroActual: this.data.numeroActual,
        idEstado: this.data.idEstado
      });
    }

    /**************************************************************************************************
     * Events
     */
    evtOnSubmit(): void {
        this.submitted = true;

        if (this.frmGroup.invalid) {
            this.utilsService.mostrarToast('Datos incompletos!!!', 'info');
            return;
        }

        if (this.data ){
            // EDITAR
          Swal.fire({
            html: `Desea editar los datos del registro??`,
            icon: 'question',
            allowOutsideClick: false,
            allowEscapeKey: false,
            buttonsStyling: false,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            showCancelButton: true,
            customClass: {
              popup: 'popins rounded-grant shadow',
              confirmButton: 'btn sbtn btn-primary btn-active-primary popins',
              cancelButton: 'btn sbtn btn-light popins mr-2',
            },
            reverseButtons: true
          }).then(
            result => {
              if(result.isConfirmed) {

                this.ldSubmit = true;
                this.api.modificar(this.model).subscribe((res: boolean | ErrorSistema)=> {

                    if (res instanceof ErrorSistema){
                      this.utilsService.mostrarToast(res.message, 'error');
                      this.ldSubmit = false;
                    }else{
                      this.utilsService.mostrarToast(`Se modificaron los datos con exito`, 'success');
                      this.OnUpdated.emit();
                      this.ldSubmit = false;
                      this.cerrarModal(true);
                    }

                  },
                  error => {
                    this.utilsService.mostrarToast('Error al intentar modificar los datos', 'error');
                    console.log('Error al modificar los datos', error);
                    this.ldSubmit = false;
                  });
              }else{
                this.cerrarModal();
              }
            }
          );

        } else {
            // NUEVO
          Swal.fire({
            title: 'Desea registrar la nueva serie??',
            icon: 'question',
            allowOutsideClick: false,
            allowEscapeKey: false,
            buttonsStyling: false,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            showCancelButton: true,
            customClass: {
              popup: 'popins rounded-grant shadow',
              confirmButton: 'btn sbtn btn-primary btn-active-primary popins',
              cancelButton: 'btn sbtn btn-light popins mr-2',
            },
            reverseButtons: true
          }).then(
            result => {
              if(result.isConfirmed) {
                this.ldSubmit = true;

                this.api.registrar(this.model).subscribe((res: boolean | ErrorSistema) => {
                    if (res instanceof ErrorSistema){
                      this.utilsService.mostrarToast(res.message, 'error');
                      this.ldSubmit = false;
                    }else{
                      this.utilsService.mostrarToast(`Se registro la nueva serie con exito`, 'success');
                      this.OnCreated.emit();
                      this.ldSubmit = false;
                      this.cerrarModal(true);
                    }
                  },
                  error => {
                    this.ldSubmit = false;
                    console.log('Error al registrar la unidad de medida', error);
                    this.utilsService.mostrarToast('Error al intentar registrar los datos', 'error');
                  });
              }
            }
          );
        }
    }

    cerrarModal( res: boolean = false ): void {
        this.modal.close(res);
    }

    /*****************************************************************************************************
     * Obtener listado de las sedes
     */
    obtenerSedes(): void{
      this.ldSedes = true;
      this.sbcSede = this.sedeService.obtener().subscribe((res: any[]) => {
        this.sedes = res.map(x => {
          const model = new Sede();
          model.id = x.idSede;
          model.nombre = x.nombre;
          return model;
        });
        this.ldSedes = false;
      }, (error: any) => {
        this.ldSedes = false;
        console.log(error);
        this.utilsService.mostrarToast('Ocurrio un error al intentar obtener las sedes', 'error');
      });
    }


  /*****************************************************************************************************
   * Obtener listado de las tipos de comprobante
   */
  obtenerTiposComprobante(): void{
    this.ldTiposComprobante = true;
    this.sbcTiposComprobante = this.tiposComprobanteService.obtener().subscribe((res: any[]) => {
      this.tiposComprobante = res.map(x => {
        const model = new TipoComprobante();
        model.id = x.id;
        model.descripcion = x.descripcion;
        return model;
      });
      this.ldTiposComprobante = false;
    }, (error: any) => {
      this.ldTiposComprobante = false;
      console.log(error);
      this.utilsService.mostrarToast('Ocurrio un error al intentar obtener los tipos de comprobante', 'error');
    });
  }

}
