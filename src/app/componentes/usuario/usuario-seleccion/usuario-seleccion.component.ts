import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UtilsService } from 'src/app/shared/services/funciones/utils.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CONFIG } from 'src/app/shared/configuracion/config';

@Component({
  selector: 'app-usuario-seleccion',
  templateUrl: './usuario-seleccion.component.html',
  styleUrls: ['./usuario-seleccion.component.scss']
})
export class UsuarioSeleccionComponent implements OnInit, AfterViewInit {
  @Output() eventUsuarioSeleccionado = new EventEmitter<any>();
  @Input() modal: NgbModalRef;
  @Input() idPerfil: string = '';
  @Input() idSede?: number = 0;

  idUsuarioSeleccionado: number = 0;
  nombreUsuarioSeleccionado: string = '';
  userList: any;
  userListTemp: any;
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';
  imgNulled: string;

  constructor(
    private usuarioService: UsuarioService,
    private utilsService: UtilsService,
    private spinner: NgxSpinnerService,
  ) {
    this.imgNulled = CONFIG.imgNulled;
  }

  ngOnInit(): void {
    console.log(this.idPerfil, this.idSede);
  }
  ngAfterViewInit(): void {
    this.buildtable();
  }

  cerrarModal(): void {
    this.modal.close();
  }

  buildtable(): void{
    const mensajeError = 'Error al obtener usuario';
    this.spinner.show();
    this.usuarioService.obtenerByIdPerfil(this.idPerfil, this.idSede).subscribe(
      data => {
        this.userList = data;
        this.userListTemp = data;
        this.spinner.hide();
      },
      error => {
        console.log(mensajeError, error);
        this.spinner.hide();
      }
    );
  }

  buscarUsuario(buscar: boolean): void {
    if(buscar) {
      const valor = $('#msg-friends').val().toString().toLowerCase();

      if(valor != '') {
        var results = [];
        const campos = [ 'nombre', 'usuario','sede'];
        for(var i = 0; i < this.userList.length; i++) {
          for(var c = 0; c < campos.length; c++) {
            if(this.userList[i][campos[c]].toLowerCase().indexOf(valor)!=-1) {
              if(results.length > 0 ) {
                if(results.filter(x => x.idUsuario == this.userList[i].idUsuario).length == 0) results.push(this.userList[i]);
              } else {
                results.push(this.userList[i]);
              }
            }
          }
        }
        this.userListTemp = results;
      } else {
        this.userListTemp = this.userList;
      }
    } else {
      $('#msg-friends').val('');
      this.userListTemp = this.userList;
    }
  }
  
  devolverUsuario(usuario): void {
    this.eventUsuarioSeleccionado.emit(usuario);
    this.cerrarModal();
  }


}
