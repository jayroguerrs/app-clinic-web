import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ZonaCorporalService } from '../../../shared/services/zona-corporal.service';
import { PromocionZonaService } from '../../../shared/services/promocionZona.services';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { Usuario } from 'src/app/shared/models/usuario';
import { PromocionPrecioService } from '../../../shared/services/promocionPrecio.services';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PromocionBloqueService } from '../../../shared/services/promocionBloque.services';
import { NgxSpinnerService } from 'ngx-spinner';
import {ErrorSistema} from "../../../shared/models/error-sistema";
declare var $: any;
import Swal from 'sweetalert2';

@Component({
  selector: 'app-promocion-precio',
  templateUrl: './promocion-precio.component.html',
  styleUrls: ['./promocion-precio.component.scss']
})
export class PromocionPrecioComponent implements OnInit {

  @Input() idPromocion: number;
  @Input() promocion: string;
  @Input() idServicio: number;
  @Input() modal:NgbModalRef;
  @ViewChild('tbodyHombre') tbodyHombre: ElementRef;
  @ViewChild('tbodyMujer') tbodyMujer: ElementRef;

  frmPromocionPrecio: FormGroup;
  generos = [ {descripcion: 'TODOS', valor: 0},
              {descripcion: 'HOMBRES', valor: 1},
              {descripcion: 'MUJERES', valor: 2}];
  zonasCorporales: any[];
  promoZonasMujer = [];
  promoZonasHombre = [];
  promocionBloques = [];
  promocionPrecioBloque = [];
  usuarioActual: Usuario;
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  constructor(
    private zonaCorporalService: ZonaCorporalService,
    private promocionZonaService: PromocionZonaService,
    private promocionPrecioService: PromocionPrecioService,
    private promocionBloqueService: PromocionBloqueService,
    private utilsService: UtilsService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private r: Renderer2,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {

    console.log('servicio', this.idServicio);

    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.inicializarFormulario();
    this.obtenerZona();
    this.obtenerPromoZona(0);
  }

  inicializarFormulario(): void{
    this.frmPromocionPrecio = this.formBuilder.group({
      idGenero: [0],
      zonaUsar: [0],
      precio: [0],
      porcentaje: [0]
    });
  }
  obtenerZona() {
    //carga el option select de zonas corporales segun el genero seleccionado
    const idGenero = parseInt(this.frmPromocionPrecio.controls.idGenero.value, 10);
    this.zonaCorporalService.zonaCorporalByGeneroByServicioListar(idGenero, this.idServicio).subscribe(
      resp => this.zonasCorporales = resp,
      error => console.log('error en obtener', error));
  }
  obtenerPromoZona(idGenero: number) {
    this.spinner.show();

    //carga las zonas de promocion actual, las separa en hombre y mujer
    if (idGenero==0) {
      this.promoZonasMujer = [];
      this.promoZonasHombre = [];
    } else {
      idGenero == 1 ? this.promoZonasHombre = [] : this.promoZonasMujer = [];
    }

    // console.log(this.idServicio);

    this.promocionZonaService.obtenerByIdPromocionByServicio(this.idServicio, this.idPromocion, idGenero).subscribe(
      resultado => {

        resultado.forEach( element => {
          element.seleccionado = false;
          if (element.sexo == '1') {
            this.promoZonasHombre.push(element);
          } else {
            this.promoZonasMujer.push(element)
          }
          // console.log(element);
        });
        this.spinner.hide();
      },
      error => {
        console.log('Error al obtener PromocionZonas ' + error);
        this.spinner.hide();
      }
    );

    this.obtenerPromocionBloqueByIdPromocion();
  }
  obtenerPromocionBloqueByIdPromocion() {
    this.spinner.show();
    //obtiene los bloques configurados por cada zona de la promocion
    this.promocionBloqueService.obtenerByIdPromocion(this.idPromocion).subscribe(
      resultado => {
        this.promocionBloques = resultado;
        this.spinner.hide();
      },
      error => {
        console.log('Error en obtener PromocionBloque ' + error)
        this.spinner.hide();
      }
    );
    this.obtenerPromoPrecioByIdpromocion(this.idPromocion);
  }

  obtenerPromoPrecioByIdpromocion(id) {
    this.spinner.show();
    //obtiene los precios por cada bloque configurado en cada zona de la promocion
    this.promocionPrecioService.obtenerByIdpromocion(id).subscribe(
      resultado => {
        setTimeout(() => this.setearPromocionPreciosBloque(resultado), 10);
        this.spinner.hide();
      },
      error => {
        console.log('Error al obtener preciosa por bloque zona' + error);
        this.spinner.hide();
      }
    );
  }

  setearPromocionPreciosBloque(promocionPrecioBloque){
    this.spinner.show();
    promocionPrecioBloque.forEach(precio => $('input[data-idpz=' + precio.idPromocionZona + '][data-idpb=' + precio.idPromocionBloque + ']').attr('value', precio.precio));
    this.spinner.hide();
  }

  grabarPromocionPB(event, id){
    const modelPrecioBase = {
      idPromocionZona: id,
      precioBase: Number(event.target.value),
      usuarioEdita: this.usuarioActual.nombre
    };

    this.spinner.show();
    this.promocionZonaService.actualizarPrecioBase(modelPrecioBase).subscribe(
      resultado => {
        this.utilsService.mostrarToast(resultado.mensaje, 'info');
        this.spinner.hide();
      },
      error => {
        this.utilsService.mostrarToast('Error al actualizar precio de zona ', error);
        this.spinner.hide();
      }
    );
  }
  grabarPromocionPrecioBloque(event, idPromocionZona, idPromocionBloque){
    var modelPrecio = {
      idPromocionZona: idPromocionZona,
      idPromocionBloque: idPromocionBloque,
      precio: Number(event.target.value),
      usuarioRegistra: this.usuarioActual.nombre
    };

    this.spinner.show();
    this.promocionPrecioService.guardar(modelPrecio).subscribe(
      resultado => {
        this.utilsService.mostrarToast(resultado.mensaje, 'info');
        this.spinner.hide();
      },
      error => {
        this.utilsService.mostrarToast('PROMOCIÓN PRECIO', error);
        this.spinner.hide();
      }
    );
  }
  onChangeGenero(): void {
    this.obtenerZona();
  }
  deleteFile(promocionZona){
    const fila = $('[data-idpz=' + promocionZona.idPromocionZona+ ']')[0];
    this.promocionZonaService.deleteById(promocionZona.idPromocionZona).subscribe(resultado => {
        if (resultado.exito) {
          // console.log(promocionZona);
          promocionZona.sexo == 1 ? this.r.removeChild(this.tbodyHombre.nativeElement, fila) : this.r.removeChild(this.tbodyMujer.nativeElement, fila);
        }
        this.utilsService.mostrarToast(resultado.mensaje, resultado.exito ? 'success' : 'error');
      });
  }
  cerrarModal(): void{ this.modal.close(); }
  agregarZonaCorporal(): void {
    const idZona = parseInt(this.frmPromocionPrecio.controls.zonaUsar.value, 10);
    const idGenero = parseInt($('option[value=' + idZona + '][data-zonas]').attr('data-idgenero'), 10);
    const precioBase = parseFloat(this.frmPromocionPrecio.controls.precio.value);
    //VALIDAR SI EXISTE LA ZONA DENTRO DE LA PROMOCION
    const fila = $('[data-idzonacorporal=' + idZona + ']')[0];

    if(fila == undefined){
      const model = {
        idPromocion : this.idPromocion,
        idZona,
        idGenero,
        precioBase,
        Activo: 1,
        usuarioRegistra: this.usuarioActual.nombre,
        promocionPrecios: this.detallePrecios
      }
      this.promocionZonaService.guardar(model).subscribe(
        resultado => {
          this.obtenerPromoZona(idGenero);
        });
    } else {
      this.utilsService.mostrarToast('Zona corporal ya ha sido asignada a la promoción', 'info');
    }
  }
  get detallePrecios(): any {
    const detallePrecios = [];
    $.each($('.rTableCell input'),function(){
      detallePrecios.push({
        idPromocionBloque: parseInt($(this).attr('data-idpb'), 10),
        precio: parseFloat($(this).val()),
        })
    });
    return detallePrecios;
  }


  // Eventos
  selectZonaMujer(evento: any, index: number): void{
    const seleccionado = evento.target.checked;
    this.promoZonasMujer.find((x,y) => y === index).seleccionado = seleccionado;
  }
  selectTodoZonaMujer(evento: any): void{
    const seleccionado = evento.target.checked;
    this.promoZonasMujer.forEach(x => {
      x.seleccionado = seleccionado;
    });
  }
  selectZonaHombre(evento: any, index: number): void{
    const seleccionado = evento.target.checked;
    this.promoZonasHombre.find((x,y) => y === index).seleccionado = seleccionado;
  }
  selectTodoZonaHombre(evento: any): void{
    const seleccionado = evento.target.checked;
    this.promoZonasHombre.forEach(x => {
      x.seleccionado = seleccionado;
    });
  }
  borrarZonaMujerSeleccionada(): void{
    const zonas = this.promoZonasMujer.filter(x => x.seleccionado);
    if(zonas.length){
      this.promocionZonaService.deleteByIds( zonas.map(x => x.idPromocionZona.toString()).join(',')).subscribe((res: number[] | ErrorSistema) => {
        if(res instanceof ErrorSistema){
          this.utilsService.mostrarToast(res.message,'error');
        }else{
          this.promoZonasMujer = this.promoZonasMujer.filter(x => !res.includes(x.idPromocionZona));
          this.utilsService.mostrarToast('SE ELIMINARON CORRECTAMENTE LAS ZONAS!','success');
        }
      }, error => {
        console.log(error);
      })
    }
  }
  borrarZonaHombreSeleccionada(): void{
    const zonas = this.promoZonasHombre.filter(x => x.seleccionado);
    if(zonas.length){
      this.promocionZonaService.deleteByIds( zonas.map(x => x.idPromocionZona.toString()).join(',')).subscribe((res: number[] | ErrorSistema) => {
        if(res instanceof ErrorSistema){
          this.utilsService.mostrarToast(res.message,'error');
        }else{
          this.promoZonasHombre = this.promoZonasHombre.filter(x => !res.includes(x.idPromocionZona));
          this.utilsService.mostrarToast('SE ELIMINARON CORRECTAMENTE LAS ZONAS!','success');
        }
      }, error => {
        console.log(error);
      })
    }
  }
}
