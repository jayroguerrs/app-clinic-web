import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from 'src/app/shared/models/usuario';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { PerfilService } from '../../../shared/services/perfil.service';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalConstants } from 'src/commons/global-constants';

@Component({
  selector: 'app-perfil-configuracion',
  templateUrl: './perfil-configuracion.component.html',
  styleUrls: ['./perfil-configuracion.component.scss']
})
export class PerfilConfiguracionComponent implements OnInit {
@Input() modal: NgbModalRef;
@Input() idPerfil: number = 0;

  active = 1;
  pillSeleccionado = 1;
  frmPerfilConfiguracion: FormGroup;
  maestroMenu: any = [];
  maestroDashboardElementos: any = [];
  perfilDetalleSeleccionado: any = [];
  usuarioActual: Usuario;
  rutaImageSpinner = GlobalConstants.gIconoSpinner;
  
  constructor(
    private formBuilder: FormBuilder,
    private perfilService: PerfilService,
    private usuarioService: UsuarioService,
    private utilsService: UtilsService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.menuListado();
    this.inicializarFormulario();
  }

  menuListado() {
    this.spinner.show();
    this.perfilService.obtenerById(this.idPerfil).subscribe(
      resultado => {
        this.maestroMenu = resultado.menus;
        this.maestroDashboardElementos = resultado.dashboardElementos;
        this.perfilDetalleSeleccionado = resultado.detalle;
        this.frmPerfilConfiguracion.patchValue({
          perfilNombre: resultado.nombre
        });
        this.spinner.hide();
      },
      error => {
        console.log('Error al obtener el menu', error);
        this.spinner.hide();
      }
    );
  }
  inicializarFormulario(): void {
    this.frmPerfilConfiguracion = this.formBuilder.group({
      perfilNombre: ['']
    });
  }
  cerrarModal(): void {
    this.modal.close();
  }
  guardarObjeto(tipoElemento: number): void {
    //al cambiar de tab o pills almacenar los valores seleccionados, sino se pierde
    this.pillSeleccionado = tipoElemento;

    const checks = $('input:checked');
    this.perfilDetalleSeleccionado = this.perfilDetalleSeleccionado.filter(x => x.idTipoElemento != tipoElemento);

    for(var i = 0 ; i < checks.length; i++){
      const idElemento = parseInt(checks[i].getAttribute('id'), 10);
      const idTipoElemento = parseInt(checks[i].getAttribute('tipoElemento'), 10);
      if(this.perfilDetalleSeleccionado.length > 0 ) {
        const existe = this.perfilDetalleSeleccionado.filter(x => x.idElemento == idElemento && x.idTipoElemento ==  idTipoElemento);
        if(existe.length == 0) {
          const dato = {
            id: 0,
            idPerfil: this.idPerfil,
            idElemento,
            idTipoElemento
          };
          this.perfilDetalleSeleccionado.push(dato);
        }
      } else {
        const dato = {
          id: 0,
          idPerfil: this.idPerfil,
          idElemento,
          idTipoElemento
        };
        this.perfilDetalleSeleccionado.push(dato);
      }
    }
  }
  perfilGrabar(): void {

    this.guardarObjeto(this.pillSeleccionado);
    const perfil = {
      idPerfil: this.idPerfil,
      nombre: this.frmPerfilConfiguracion.controls.perfilNombre.value.toUpperCase(),
      perfilDetalle: this.perfilDetalleSeleccionado
    }

    this.spinner.show();
    if(this.idPerfil > 0) {
      this.perfilService.modificar(perfil).subscribe(
        resultado => {
          this.utilsService.mostrarToast('Perfil actualizado satisfactoriamente', 'success');
          this.spinner.hide();
          this.cerrarModal();
        },
        error => {
          console.log('Error al actualizar el perfil', error);
          this.spinner.hide();
        }
      );
    } else {
      this.perfilService.grabar(perfil).subscribe(
        resultado => {
          this.utilsService.mostrarToast(resultado.mensaje, 'success');
          this.spinner.hide();
          this.cerrarModal();
        },
        error => {
          console.log('Error al registrar el perfil', error);
          this.spinner.hide();
        }
      );
    }
  }
}