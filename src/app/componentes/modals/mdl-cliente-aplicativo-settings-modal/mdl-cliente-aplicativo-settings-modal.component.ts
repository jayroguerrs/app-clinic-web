import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PreferenteService } from '../../../shared/services/preferente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mdl-cliente-aplicativo-settings-modal',
  templateUrl: './mdl-cliente-aplicativo-settings-modal.component.html',
  styleUrls: ['./mdl-cliente-aplicativo-settings-modal.component.scss']
})
export class MdlClienteAplicativoSettingsModalComponent implements OnInit {
  @Input() idCita: number;
  @Output() eventListarCitas: any = new EventEmitter<boolean>();

  constructor(
    public modal: NgbActiveModal,
    public preferenteService: PreferenteService
  ){}

  ngOnInit(): void {
  }

  cerrarModal( result: boolean = false ): void {
    this.modal.close(result);
  }

  cambiarEstadoCita(idEstado: number) {

    Swal.fire({
      title: "Actualizar Estado",
      html: `¿Quiere cambiar el estado de la cita?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, Actualizar!",
      cancelButtonText: "No, Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.preferenteService.actualizarEstadoPrefMobile(this.idCita ,idEstado).subscribe((resp : any) => {
          if( resp.status === 200 ) {
            Swal.fire('Actualizado!', '', 'success');

            this.eventListarCitas.emit(true);
          } else{
            Swal.fire({
              title: 'Error',
              text: 'Sucedió un error al actualizar el estado de la cita.',
              icon: 'error',
            });
          }
        })
  
      }})
  }
}
