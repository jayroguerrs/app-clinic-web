import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UsuarioService} from "../../../shared/services/usuario.service";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {AuthService} from "../../../shared/services/auth.service";
import {ClienteService} from "../../../shared/services/cliente.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AccionCita, AccionCronograma, EnumServicio} from 'src/app/shared/enumeracion/enums';

import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import {Preferente} from "../../../shared/models/preferente.model";

@Component({
    selector: 'app-mdl-agendar-cita',
    templateUrl: 'mdl-agendar-cita.component.html'
})

export class MdlAgendarCitaComponent implements OnInit, OnDestroy {

    @Input() idPreferente: number = 0;
    @Input() idCliente: number = 0;
    @Input() esPreferente: boolean = false;
    @Input() preferente: Preferente | null = null;
    AccionCita = AccionCita;
    AccionCronograma = AccionCronograma;

    uuid = uuidv4();

    enumServicio = EnumServicio

    constructor(
      private usuarioService: UsuarioService,
      private utilsService: UtilsService,
      private modal: NgbActiveModal,
      private auth: AuthService,
      private clientService: ClienteService,
      private activatedRoute: ActivatedRoute,
      private router: Router,
    ) {

    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {

    }

    navegarSegunDispositivo(servicio: any, servicioEnum: any, es360: boolean = false): void {
      const urlNormal = this.router.createUrlTree([
        servicio,
        0,
        AccionCita.NUEVA,
        this.idCliente,
        this.idPreferente,
        servicioEnum
      ]);

      const url360 = this.router.createUrlTree([
        servicio,
        0,
        AccionCronograma.NUEVA,
        this.idCliente,
        this.idPreferente,
        servicioEnum,
        0
      ]);
      const url = es360 ? url360 : urlNormal;
      if (this.utilsService.isLargeScreen()) {
        // Abrir en una nueva pestaña si no es móvil
        window.open(url.toString(), '_blank');
      } else {
        // Navegar internamente si es móvil
        this.router.navigateByUrl(url);
      }

      this.cerrarModal();
    }

    cerrarModal( res: boolean = false ): void {

        if(this.esPreferente){
          Swal.fire({
            title: '¿Desea cerrar el cuadro de cita?',
            icon: 'question',
            focusConfirm: true,
            allowEscapeKey: false,
            allowOutsideClick: false,
            confirmButtonText: 'SI',
            showCancelButton: true,
            cancelButtonText: 'NO',
            buttonsStyling: false,
            reverseButtons: true,
            customClass: {
              confirmButton: "popins sbtn btn btn-primary w-100px",
              cancelButton: "popins sbtn btn btn-light w-100px mr-2",
            }

          }).then((result) => {
            if (result.isConfirmed) {
              this.modal.close(res);
            }
          });
          return;
        }

        this.modal.close(res);
    }

}
