import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import {FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from '../../../shared/models/usuario';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { PerfilService } from '../../../shared/services/perfil.service';
import { PromocionService } from '../../../shared/services/promocion.services';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import {PromocionCategoriaService} from "../../../shared/services/promocion-categoria.service";
import {PromocionCategoria} from "../../../shared/models/promocion";
import { Subscription } from 'rxjs';
import { ServicioService } from 'src/app/shared/services/servicio.service';
import {Servicio} from "../../../shared/models/servicio";

@Component({
  selector: 'app-promocion-datos',
  templateUrl: './promocion-datos.component.html',
  styleUrls: ['./promocion-datos.component.scss']
})
export class PromocionDatosComponent implements OnInit, OnDestroy {
  @Input() idPromocion: number = 0;
  @Input() modal: NgbModalRef;

  @Output() eventoPromocionListar: EventEmitter<boolean> = new EventEmitter<boolean>();

  frmPromocionDatos: FormGroup;
  usuarioActual: Usuario;
  maestroPerfiles = [];
  maestroItemsPromocion = [];
  accion = '';
  zonasUsar = [
    {descripcion: 'TODOS', valor: 0},
    {descripcion: 'MUJERES', valor: 1},
    {descripcion: 'HOMBRES', valor: 2},
    {descripcion: 'NINGUNO', valor: 3}
  ];

  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  @ViewChild('bloque') tbody: ElementRef;
  categorias: PromocionCategoria[] = [];
  sbcCategorias: Subscription;

  servicios: Servicio[] = [];
  sbcServicios: Subscription;

  submitted = false;

  constructor(
    private usuarioService: UsuarioService,
    private perfilService: PerfilService,
    private promocionService: PromocionService,
    private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private renderer: Renderer2,
    private spinner: NgxSpinnerService,
    private categoria: PromocionCategoriaService,
    private servicioService: ServicioService
  ) { }

  ngOnInit(): void {
    this.listarServicios();
    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.obtenerPerfil();
    this.obtenerPromocion();
    this.obtenerCategorias();
    if(this.idPromocion > 0)
    {
      this.accion = 'Editar';
      $('#precioBase').prop('disabled', true);
      $('#zonaUsar').prop('disabled', true);
      this.inicializarFormulario();
      this.promocionBuscar();
    } else {
      this.inicializarFormulario();
      this.accion = 'Nuevo';
    }
  }

  ngOnDestroy(): void {
    this.sbcCategorias?.unsubscribe();
    this.sbcServicios?.unsubscribe();
  }


  inicializarFormulario(): void{
    this.frmPromocionDatos = this.formBuilder.group({
      nombre: ['', Validators.required],
      fechaInicio: [''],
      fechaFin: [''],
      chkLu: [''],
      chkMa: [''],
      chkMi: [''],
      chkJu: [''],
      chkVi: [''],
      chkSa: [''],
      chkDo: [''],
      condicion: [''],
      precioBase: [''],
      zonaUsar: [''],
      perfilAcceso: [''],
      activo: [1],
      idPromocionCategoria: new FormControl(''),
      idServicio: new FormControl('', Validators.required),
      vigente: new FormControl(0, Validators.required)
    });
  }
  obtenerCategorias(): void{
    this.sbcCategorias = this.categoria.listar().subscribe((res: PromocionCategoria[]) => {
      this.categorias = res;
    }, error => {
      console.log(error);
    });
  }
  obtenerPerfil() { this.perfilService.obtener().subscribe(resultado => this.maestroPerfiles = resultado);}
  obtenerPromocion() {this.promocionService.obtener(0).subscribe(resultado => this.maestroItemsPromocion = resultado); }
  promocionBuscar() {
    this.spinner.show();
    this.promocionService.obtenerById(this.idPromocion).subscribe(
      resp => {
        this.frmPromocionDatos.patchValue({
          nombre: resp.descripcion,
          chkLu: resp.lu,
          chkMa: resp.ma,
          chkMi: resp.mi,
          chkJu: resp.ju,
          chkVi: resp.vi,
          chkSa: resp.sa,
          chkDo: resp.do,
          condicion: resp.condicion,
          precioBase: (resp.refPrecio==null)? 0:resp.refPrecio,
          zonaUsar: resp.zonaUsar,
          perfilAcceso: resp.idPerfil ? resp.idPerfil : '',
          activo: resp.activo,
          idPromocionCategoria: resp.idPromocionCategoria ? resp.idPromocionCategoria : '',
          idServicio: resp.idServicio ? resp.idServicio : '',
          vigente: resp.vigente ? 1 : 0
        });
        this.frmPromocionDatos.get('fechaInicio').patchValue(this.utilsService.formatDate(resp.fechaInicio));
        this.frmPromocionDatos.get('fechaFin').patchValue(this.utilsService.formatDate(resp.fechaFin));
        resp.promocionBloques.forEach(element => this.addBloque(element));
        this.spinner.hide();
      },
      error => {
        console.log('Error al obtener la promoción ' + error);
        this.spinner.hide();
      }
    );
  }
  cerrarModal(): void{
    this.modal.close();
  }
  get promocion(): any{
    // Sesiones
    var sessiones = []
    var filas =(<HTMLTableElement>document.getElementById("tbSessiones")).rows;
    for (var i = 0; i < filas.length; i++) {
      const itemSessiones = {
        id : parseInt(filas[i].getAttribute('data-id'), 10),
        idPromocion: this.idPromocion,
        rangoIni: parseInt((<HTMLInputElement>filas[i].children[0].children[0]).value, 10),
        rangoFin: parseInt((<HTMLInputElement>filas[i].children[1].children[0]).value, 10),
        descuentoPorcentaje: parseInt((<HTMLInputElement>filas[i].children[2].children[0]).value, 10),
        DescuentoFijo: parseInt((<HTMLInputElement>filas[i].children[3].children[0]).value, 10),
        AumentFijo: parseInt((<HTMLInputElement>filas[i].children[4].children[0]).value, 10)
      };
      sessiones.push(itemSessiones);
    }

    let idPerfil = this.frmPromocionDatos.controls.perfilAcceso.value;
    idPerfil = idPerfil == '' ? null : parseInt(idPerfil, 10);

    let lu = this.frmPromocionDatos.controls.chkLu.value;
    lu = lu == '' ? false : lu;

    let ma = this.frmPromocionDatos.controls.chkMa.value;
    ma = ma == '' ? false : ma;

    let mi = this.frmPromocionDatos.controls.chkMi.value;
    mi = mi == '' ? false : mi;

    let ju = this.frmPromocionDatos.controls.chkJu.value;
    ju = ju == '' ? false : ju;

    let vi = this.frmPromocionDatos.controls.chkVi.value;
    vi = vi == '' ? false : vi;

    let sa = this.frmPromocionDatos.controls.chkSa.value;
    sa = sa == '' ? false : sa;

    let dox = this.frmPromocionDatos.controls.chkDo.value;
    dox = dox == '' ? false : dox;

    const model = {
      activo: parseInt(this.frmPromocionDatos.controls.activo.value, 10),
      refPrecio: parseInt(this.frmPromocionDatos.controls.precioBase.value, 10),
      condicion: this.frmPromocionDatos.controls.condicion.value.trim(),
      descripcion: this.frmPromocionDatos.controls.nombre.value.trim(),
      fechaInicio: this.frmPromocionDatos.controls.fechaInicio.value,
      fechaFin: this.frmPromocionDatos.controls.fechaFin.value,
      idPromocion: this.idPromocion,
      idPerfil: this.f.perfilAcceso.value ? parseInt(this.f.perfilAcceso.value, 10) : 0,
      lu,
      ma,
      mi,
      ju,
      vi,
      sa,
      do: dox,
      zonaUsar: parseInt(this.frmPromocionDatos.controls.zonaUsar.value, 10),
      usuarioModifica: this.usuarioActual.nombre,
      usuarioRegistra: this.usuarioActual.nombre,
      promocionBloques: sessiones,
      idPromocionCategoria: this.frmPromocionDatos.controls.idPromocionCategoria.value ? parseInt(this.frmPromocionDatos.controls.idPromocionCategoria.value, 10) : null,
      idServicio: this.f.idServicio.value ? parseInt(this.f.idServicio.value, 10) : 0,
      vigente: parseInt(this.f.vigente.value, 10) === 1 ? true : false
    };
    console.log(model, this.f.idServicio.value );

    return model;
  }
  promocionGrabar(): void {
    this.submitted = true;
    this.spinner.show();

    if(this.frmPromocionDatos.invalid){
      this.utilsService.mostrarToast('Datos incompletos!!!', 'info');
      this.spinner.hide();
      return;
    }

    if(this.idPromocion > 0) {
      // EDITAR
      this.promocionService.actualizar(this.promocion).subscribe(
        resultado => {
          if(resultado.exito) {
            Swal.fire(resultado.mensaje).then(result => this.eventoPromocionListar.emit(true));
            this.cerrarModal();
          } else {
            this.utilsService.mostrarToast(resultado.mensaje + ': ' + resultado.errorDetalle, 'error');
          }
          this.spinner.hide();
        },
        error => {
          console.log('Error al actualizar la promocion: ' + error);
          this.spinner.hide();
        });
    } else {
      // NUEVO
      this.promocionService.guardar(this.promocion).subscribe(
        resultado => {
          if(resultado.exito) {
            Swal.fire(resultado.mensaje).then(result => this.eventoPromocionListar.emit(true));
            this.cerrarModal();
          } else {
            this.utilsService.mostrarToast(resultado.mensaje + ': ' + resultado.errorDetalle, 'error');
          }
          this.spinner.hide();
        },
        error => {
          console.log('Error al registrar la promoción: ' + error);
          this.spinner.hide();
        }
      );
    }
  }
  addBloque(dato) {
    const r = this.renderer;
    // Fila
    const tr: HTMLTableRowElement = r.createElement('tr',);
    r.addClass(tr, 'trSesion');
    r.setAttribute(tr, 'data-id', dato != 0 ? dato.id : 0);
    //Celdas
    let celdas: HTMLTableCellElement[] = [];

    if(this.idPromocion == 0){
      celdas.push(
            r.createElement('td'),
            r.createElement('td'),
            r.createElement('td'),
            r.createElement('td'),
            r.createElement('td'),
            r.createElement('td'));
    } else {
      celdas.push(
        r.createElement('td'),
        r.createElement('td'),
        r.createElement('td'),
        r.createElement('td'),
        r.createElement('td'));
    }

    // Elementos
    let elementos: HTMLElement[] = [];
    if(this.idPromocion == 0) {
    elementos.push(
        r.createElement('input'),
        r.createElement('input'),
        r.createElement('input'),
        r.createElement('input'),
        r.createElement('input'),
        r.createElement('button'));
    } else {
        elementos.push(
          r.createElement('input'),
          r.createElement('input'),
          r.createElement('input'),
          r.createElement('input'),
          r.createElement('input'));
    }
    // Celda Rango
    r.addClass(elementos[0], 'form-control');
    r.addClass(elementos[0], 'input-d');
    r.setAttribute(elementos[0], 'type', 'number');
    r.setStyle(elementos[0], 'padding', '5px 10px');
    r.setAttribute(elementos[0], dato == 0 ? 'enabled' : 'disabled', 'true');
    r.setProperty(elementos[0], 'value' , dato!= 0 ? dato.rangoIni : '')
     // Celda Rango
     r.addClass(elementos[1], 'form-control');
     r.addClass(elementos[1], 'input-d');
     r.setAttribute(elementos[1], 'type', 'number');
     r.setStyle(elementos[1], 'padding', '5px 10px');
     r.setAttribute(elementos[1], dato == 0 ? 'enabled' : 'disabled', 'true');
     r.setProperty(elementos[1], 'value' , dato!= 0 ? dato.rangoFin : '')
    // Celda Descuento
    r.addClass(elementos[2], 'form-control');
    r.addClass(elementos[2], 'input-d');
    r.setAttribute(elementos[2], 'type', 'number');
    r.setStyle(elementos[2], 'padding', '5px 10px');
    r.setAttribute(elementos[2], dato == 0 ? 'enabled' : 'disabled', 'true');
    r.setProperty(elementos[2], 'value' , dato!= 0 ? dato.descuentoPorcentaje : 0)
    // Celda descuento fijo
    r.addClass(elementos[3], 'form-control');
    r.addClass(elementos[3], 'input-d');
    r.setAttribute(elementos[3], 'type', 'number');
    r.setStyle(elementos[3], 'padding', '5px 10px');
    r.setAttribute(elementos[3], dato == 0 ? 'enabled' : 'disabled', 'true');
    r.setProperty(elementos[3], 'value' , dato!= 0 ? dato.descuentoFijo : 0)
    //Celda Aumento Fijo
    r.addClass(elementos[4], 'form-control');
    r.addClass(elementos[4], 'input-d');
    r.setAttribute(elementos[4], 'type', 'number');
    r.setStyle(elementos[4], 'padding', '5px 10px');
    r.setAttribute(elementos[4], dato == 0 ? 'enabled' : 'disabled', 'true');
    r.setProperty(elementos[4], 'value' , dato!= 0 ? dato.aumentFijo : 0)
    //Boton Eliminar
    // Solo mostrar el boton cuando se crea
    if(this.idPromocion == 0){
      r.addClass(elementos[5], 'form-control-sm');
      r.addClass(elementos[5], 'button-d');
      r.setStyle(elementos[5], 'height', 'calc(1.3em + 0.5rem + 2px)');
      r.setStyle(elementos[5], 'padding', '0.10rem 0.3rem');
      r.setStyle(elementos[5], 'font-size', '0.776rem');
      r.setStyle(elementos[5], 'line-height', '1.5');
      r.setStyle(elementos[5], 'border-radius', '0.4rem');
      r.setStyle(elementos[5], 'border-style', 'solid');
      r.setStyle(elementos[5], 'border-width', '0px');
      r.setStyle(elementos[5], 'background', 'transparent');
      r.setStyle(elementos[5], 'color', 'black');
      r.listen(elementos[5], 'click', (event) => this.eliminarFila(event.target) );
      r.setProperty(elementos[5], 'innerHTML', 'X');
    }
    //Anexar elementos
    celdas.forEach((celda, index) => {
      r.appendChild(celda, elementos[index]);
      r.appendChild(tr, celda); });
    r.appendChild(this.tbody.nativeElement, tr);
  }
  eliminarFila(buttonElement): void {
    const filaElement = buttonElement.parentNode.parentNode;
    this.renderer.removeChild(this.tbody.nativeElement, filaElement);
  }

  // data
  listarServicios(): void{
    this.sbcServicios = this.servicioService.listarByEstado(1).subscribe((res) => {
      this.servicios = res;
    }, error => {
      console.log(error);
    });
  }

  // getter
  get f(): any{
    return this.frmPromocionDatos.controls;
  }
}
