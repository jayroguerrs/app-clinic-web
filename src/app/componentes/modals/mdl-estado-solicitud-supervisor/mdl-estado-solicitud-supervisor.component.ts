import { Component, Input, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../shared/services/auth.service';
import { paths } from '../../../../commons/routes';

@Component({
  selector: 'app-mdl-estado-solicitud-supervisor',
  templateUrl: './mdl-estado-solicitud-supervisor.component.html',
  styleUrls: ['./mdl-estado-solicitud-supervisor.component.scss']
})
export class MdlEstadoSolicitudSupervisorComponent implements OnInit {
  
  constructor(
    private authService: AuthService
  ) { }
  
  @Input() modal!: NgbModalRef;
  @Input() estadoDeAprobacion!: number;
  
  ngOnInit(): void {
  }

  cerrarModal(): void {
    this.modal.close();
  }

  recargar(): void {
    try {
      // Cierra el modal y recarga la página
      this.modal?.close();
    } catch {}
    // Redirige al inicio con recarga completa de la app
    setTimeout(() => {
      window.location.href = '/' + paths.home.origin;
    }, 300);
  }

  cerrarSesion(): void {
    this.authService.logout();
  }

}
