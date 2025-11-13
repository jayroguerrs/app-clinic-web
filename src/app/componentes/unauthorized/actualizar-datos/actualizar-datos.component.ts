import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { Usuario } from '../../../shared/models/usuario';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UtilsService } from '../../../shared/services/funciones/utils.service';

@Component({
  selector: 'app-actualizar-datos',
  templateUrl: './actualizar-datos.component.html',
  styleUrls: ['./actualizar-datos.component.scss', '../access/access.component.scss']
})
export class ActualizarDatosComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  usuarioActual: Usuario;
  
  constructor(
    private usuarioService: UsuarioService,
    private utilsService: UtilsService
  ) { }

  ngOnInit(): void {
    const usuarioSub = this.usuarioService.usuarioActual$.subscribe(usuario => {
      this.usuarioActual = usuario;
    });
    this.subscriptions.push(usuarioSub);

    this.usuarioActual = this.usuarioService.UsuarioActual;
  }


  mdlActualizarDatosUser: NgbModalRef;
  
  actualizarDatosUser(modal: any): void{
    this.mdlActualizarDatosUser = this.utilsService.abrirModal(modal, 'lg');
    this.mdlActualizarDatosUser.result.then(result => console.log(result, "reeeeeeeeeeeeeeeeeeeeeeeeeee"));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
