import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from 'src/app/shared/models/usuario';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import Swal from 'sweetalert2';
import { ZonaCorporalService } from '../../../shared/services/zona-corporal.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {Subscription} from "rxjs";


import { Servicio } from 'src/app/shared/models/servicio';
import {ServicioService} from "../../../shared/services/servicio.service";
import {ComprobanteUnidadMedida} from "../../../shared/models/facturacion/comprobante-unidad-medida";
import {ComprobanteUnidadMedidaService} from "../../../shared/services/facturacion/comprobante-unidad-medida.service";
import {ErrorSistema} from "../../../shared/models/error-sistema";

@Component({
    selector: 'app-zona-corporal-datos',
    templateUrl: 'zona-corporal-datos.component.html'
  })
  export class ZonaCorporalDatosComponent implements OnInit, OnDestroy, AfterViewInit {
    @Output() eventoZonaCorporalListar: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() maestroGeneros: any = [];
    @Input() maestroZonasCorporales: any = [];
    @Input() modal: NgbModalRef;
    @Input() idZonaCorporal: number;

    accion = '';
    submitted = false;
    usuarioActual: Usuario;
    frmZonaCorporalDatos: FormGroup;
    zonaCorporalDatos: any;
    rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

    // Subscriptions
    formSubscription: Subscription;
    buscarZonaSubscription: Subscription;

    archivoImagen: File = null;
    rutaImagen: any; // '../../../../assets/images/alumno.png';

    // Zonas relacionadas - autocomplete
    public zonas: Array<{id: string, text: string}>;
    public zonasSeleccionadas: Array<{id: string, text: string}> = [];
    public zonaSearchControl = new FormControl('');
    public zonasFiltradasObservable: Observable<Array<{id: string, text: string}>>;

    zonaTipos: {id: number; nombre: string}[] = [
      {id: 1, nombre: 'UNIDAD'},
      {id: 2, nombre: 'PACK'},
      {id: 3, nombre: 'MEDIO PACK'},
      {id: 4, nombre: 'TRIO'},
      {id: 5, nombre: 'DUO'},
    ]

    servicios: Servicio[] = [];
    sbcServicio: Subscription;

    unidadesMedida: ComprobanteUnidadMedida[] = [];
    ldUnidadesMedida = false;
    sbcUnidadesMedida: Subscription | undefined;

    constructor(
      private formBuilder: FormBuilder,
      private usuarioService: UsuarioService,
      private utilsService: UtilsService,
      private zonaCorporalService: ZonaCorporalService,
      private spinner: NgxSpinnerService,
      private servicioService: ServicioService,
      private comprobanteUnidadMedidaService: ComprobanteUnidadMedidaService
    ){
      this.zonas = [];
    }

    ngOnInit(): void {
      this.servicioCollection();
      // console.log(this.maestroZonasCorporales);
      this.maestroZonasCorporales.forEach((p: any) => {
        const zona = {
          id: p.id,
          text: p.descripcion + ' ' + p.genero
        };
        // console.log(zona);
        this.zonas.push(zona);
      });

      this.usuarioActual = this.usuarioService.UsuarioActual;

      // Configurar el filtrado del autocomplete
      this.configurarAutocomplete();

      if (this.idZonaCorporal > 0 ) {
        this.accion = 'Editar';
        this.inicializarFormulario();
        this.zonaCorporalBuscar();
      } else {
        this.accion = 'Nuevo';
        this.inicializarFormulario();
      }
    }

    ngAfterViewInit(): void {
      this.obtenerUnidadesMedida();
    }

  ngOnDestroy(): void {
      this.sbcServicio?.unsubscribe();
      if(this.formSubscription){
        this.formSubscription.unsubscribe();
      }
      if(this.buscarZonaSubscription){
        this.buscarZonaSubscription.unsubscribe();
      }
    }

    inicializarFormulario(): void {
      this.frmZonaCorporalDatos = this.formBuilder.group({
        zonaDescripcion: ['', Validators.required],
        zonaDescripcionLarga: [''],
        zonaDuracion: [0, Validators.required],
        // zonaIGV: [''],
        zonaPrecioBase: [0, Validators.required],
        zonaPrecioDescuento: [0, Validators.required],
        zonaIdGenero: ['', Validators.required],
        idEstado: [1, Validators.required],
        idTipo: [1, Validators.required],
        idServicio: ['', Validators.required],
        imagen: this.rutaImagen,
        urlWeb: new FormControl(null),
        zonas: new FormControl([]),
        idUnidadMedida: new FormControl('')
      });
    }
    limpiarFormulario(): void{
      this.frmZonaCorporalDatos = this.formBuilder.group({
        zonaDescripcion: [''],
        zonaDescripcionLarga: [''],
        zonaDuracion: [0],
        // zonaIGV: [''],
        zonaIdGenero: [''],
        zonaPrecioBase: [0],
        zonaPrecioDescuento: [0],
        idServicio: ['', Validators.required],
        idEstado: [''],
        idTipo: [1],
        zonas: new FormControl([]),
        idUnidadMedida: new FormControl('')
      });
    }
    get f(): any { return this.frmZonaCorporalDatos.controls; }
    get zonaCorporal(): any {
      const model = {
        id: this.idZonaCorporal,
        descripcion: this.frmZonaCorporalDatos.controls.zonaDescripcion.value,
        descripcionLarga: this.frmZonaCorporalDatos.controls.zonaDescripcionLarga.value,
        duracion: this.frmZonaCorporalDatos.controls.zonaDuracion.value,
        // igv: this.frmZonaCorporalDatos.controls.zonaIGV.value,
        idGenero: parseInt(this.frmZonaCorporalDatos.controls.zonaIdGenero.value, 10),
        idServicio: parseInt(this.frmZonaCorporalDatos.controls.idServicio.value, 10),
        idEstado: parseInt(this.frmZonaCorporalDatos.controls.idEstado.value, 10),
        usuarioEdita: this.usuarioActual.nombre,
        usuarioRegistra: this.usuarioActual.nombre,
        precioBase: parseFloat(this.frmZonaCorporalDatos.controls.zonaPrecioBase.value),
        precioDescuento: parseFloat(this.frmZonaCorporalDatos.controls.zonaPrecioDescuento.value),
        idTipo: parseInt(this.frmZonaCorporalDatos.controls.idTipo.value, 10),
        imagen: this.rutaImagen,
        urlWeb: this.f.urlWeb.value,
        zonasRel: this.zonasSeleccionadas.length > 0 ? this.zonasSeleccionadas.map(z => z.id).join(',') : null,
        idUnidadMedida: this.f.idUnidadMedida.value ? parseInt(this.f.idUnidadMedida.value, 10) : null
      };
      return model;
    }
    zonaCorporalGrabar(): void {
      this.submitted = true;

      // Validar formulario
      if (this.frmZonaCorporalDatos.invalid) {
        this.utilsService.mostrarToast('Datos incompletos!!!', 'info');
        this.spinner.hide();
        return;
      }

      this.spinner.show();
      const model = this.zonaCorporal;

      if (this.idZonaCorporal > 0 ){
        // EDITAR
        this.formSubscription = this.zonaCorporalService.actualizar(model).subscribe(
          resultado => {
            if(resultado.exito){
              Swal.fire(resultado.mensaje).then((result) => this.eventoZonaCorporalListar.emit(true));
              this.spinner.hide();
              this.cerrarModal();
            } else {
              this.utilsService.mostrarToast(resultado.mensaje + ': ' + resultado.errorDetalle, 'error');
              this.spinner.hide();
            }
          },
          error => {
            console.log('Error al actualizar la zona corporal', error);
            this.spinner.hide();
          }
        );
      } else {
        // NUEVO
        this.formSubscription = this.zonaCorporalService.guardar(model).subscribe(
          resultado => {
            if(resultado.exito) {
              Swal.fire(resultado.mensaje).then((result) => this.eventoZonaCorporalListar.emit(true));
              this.spinner.hide();
              this.cerrarModal();
            } else {
              this.utilsService.mostrarToast(resultado.mensaje + ': ' + resultado.errorDetalle, 'error');
              this.spinner.hide();
            }
          },
          error => {
            console.log('Error al registrar al cliente', error);
            this.spinner.hide();
          }
        );
      }
    }
    zonaCorporalBuscar(): void {
      this.spinner.show();
      this.buscarZonaSubscription = this.zonaCorporalService.obtenerById(this.idZonaCorporal).subscribe(
        resultado => {
          this.zonaCorporalDatos = resultado;
          this.frmZonaCorporalDatos.patchValue({
              zonaDescripcion : this.zonaCorporalDatos.descripcion,
              zonaDescripcionLarga : this.zonaCorporalDatos.descripcionLarga,
              zonaDuracion: this.zonaCorporalDatos.duracion,
              // zonaIGV: this.zonaCorporalDatos.igv,
              zonaIdGenero: this.zonaCorporalDatos.idGenero,
              zonaPrecioBase: this.zonaCorporalDatos.precioBase,
              zonaPrecioDescuento: this.zonaCorporalDatos.precioDescuento,
              idServicio: this.zonaCorporalDatos.idServicio ? this.zonaCorporalDatos.idServicio : '',
              idEstado: this.zonaCorporalDatos.idEstado,
              idTipo: this.zonaCorporalDatos.idTipo,
              urlWeb: this.zonaCorporalDatos.urlWeb,
              zonas: this.zonaCorporalDatos.zonasRel ? this.zonaCorporalDatos.zonasRel.split(',') : [],
              idUnidadMedida: this.zonaCorporalDatos.idUnidadMedida ? this.zonaCorporalDatos.idUnidadMedida : '',
          });
          
          // Cargar zonas seleccionadas para el autocomplete
          if (this.zonaCorporalDatos.zonasRel) {
            const idsSeleccionados = this.zonaCorporalDatos.zonasRel.split(',');
            this.zonasSeleccionadas = this.zonas.filter(zona => idsSeleccionados.includes(zona.id));
          }
          
          this.rutaImagen = this.zonaCorporalDatos.imagen;
          this.spinner.hide();
        },
        error => {
          console.log('Error al buscar la zona corporal!', error);
          this.spinner.hide();
        }
      );
    }
    abrirModalZonasHijas(): void{
      const idGenero = this.frmZonaCorporalDatos.controls.zonaIdGenero.value;
      if(idGenero === '')
      {
        this.utilsService.mostrarToast('Seleccione un genero', 'info');
        return;
      } else {
        // this.zonaCorporalHijoComponentModal.abrirModal(this.idZonaCorporal, idGenero);
      }
    }
    cerrarModal(): void {
      this.modal.close();
    }


    // Events
    mostrarImagen(file: FileList) {
      this.archivoImagen = file.item(0);
      const reader = new FileReader();
      reader.onload = event => this.rutaImagen = event.target.result;
      reader.readAsDataURL(this.archivoImagen);
    }
    mostrarFotoCliente(file: FileList) {
      this.archivoImagen = file.item(0);
      const reader = new FileReader();
      reader.onload = event => this.rutaImagen = event.target.result;
      reader.readAsDataURL(this.archivoImagen);
    }

    // data
    servicioCollection(): void{
      this.sbcServicio = this.servicioService.listarByEstado(1).subscribe((res) => {
        this.servicios = res;
      }, error => {
        console.log(error);
      })
    }
    obtenerUnidadesMedida(): void{
      this.ldUnidadesMedida = true;
      this.sbcUnidadesMedida = this.comprobanteUnidadMedidaService.listar2(this.usuarioService.UsuarioActual.idUsuario).subscribe((res: ComprobanteUnidadMedida[] | ErrorSistema) => {

        if (res instanceof ErrorSistema){
          Swal.fire({
            title: 'Error',
            text: res.message,
            icon: 'error',
            buttonsStyling: false,
            confirmButtonText: 'Aceptar',
            customClass: {
              popup: 'popins rounded-grant shadow',
              confirmButton: 'btn sbtn btn-primary btn-active-primary popins'
            }
          });
        }else{
          this.unidadesMedida = res;
        }
        this.ldUnidadesMedida = false;

      }, error => {
        Swal.fire({
          title: 'Error',
          text: 'Ocurrio un error al obtener las unidades de medida',
          icon: 'error',
          buttonsStyling: false,
          confirmButtonText: 'Aceptar',
          customClass: {
            popup: 'popins rounded-grant shadow',
            confirmButton: 'btn sbtn btn-primary btn-active-primary popins'
          }
        });
        this.ldUnidadesMedida = false;
      })
    }

    // Métodos para el autocomplete de zonas
    configurarAutocomplete(): void {
      this.zonasFiltradasObservable = this.zonaSearchControl.valueChanges.pipe(
        startWith(''),
        map(value => this.filtrarZonas(typeof value === 'string' ? value : ''))
      );
    }

    private filtrarZonas(valor: string): Array<{id: string, text: string}> {
      if (!valor) return this.zonas.filter(zona => !this.zonasSeleccionadas.find(sel => sel.id === zona.id));
      
      const filtroTexto = valor.toLowerCase();
      return this.zonas.filter(zona => 
        zona.text.toLowerCase().includes(filtroTexto) && 
        !this.zonasSeleccionadas.find(sel => sel.id === zona.id)
      );
    }

    seleccionarZona(event: MatAutocompleteSelectedEvent): void {
      const zonaSeleccionada = event.option.value;
      
      if (zonaSeleccionada && !this.zonasSeleccionadas.find(z => z.id === zonaSeleccionada.id)) {
        this.zonasSeleccionadas.push(zonaSeleccionada);
        this.actualizarFormControl();
      }
      
      // Limpiar el input
      this.zonaSearchControl.setValue('');
    }

    removerZona(zona: {id: string, text: string}): void {
      const index = this.zonasSeleccionadas.findIndex(z => z.id === zona.id);
      if (index >= 0) {
        this.zonasSeleccionadas.splice(index, 1);
        this.actualizarFormControl();
      }
    }

    private actualizarFormControl(): void {
      // Actualizar el FormControl con los IDs seleccionados
      const idsSeleccionados = this.zonasSeleccionadas.map(z => z.id);
      this.frmZonaCorporalDatos.get('zonas')?.setValue(idsSeleccionados);
    }
  }
