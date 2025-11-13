  import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';;
import { Usuario } from '../../../shared/models/usuario';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { FacturacionService } from '../../../shared/services/facturacion.service'
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;

@Component({ selector: 'app-tickets-anular',
templateUrl: 'anular-ticket.component.html' })

export class TicketAnularComponent implements OnInit{
  @Input() idVenta: number;
  @Input() modal: NgbModalRef;
  @Output() eventTicketEliminado = new EventEmitter<any>();

  usuarioActual: Usuario;

  constructor(
    private usuarioService: UsuarioService,
    private utilsService: UtilsService,
    private facturacionService: FacturacionService
    ) {
  }

  ngOnInit(): void {
    this.usuarioActual = this.usuarioService.UsuarioActual;
  }

  anularTicket(): void {
    this.facturacionService.anularTicket(this.idVenta,this.usuarioActual.idUsuario).subscribe(
      resultado => {
        if(resultado.exito) {
          this.utilsService.mostrarToast(resultado.mensaje, 'success');
          this.eventTicketEliminado.emit(resultado);
          this.cerrarModal();
        } else {
          this.utilsService.mostrarToast(resultado.mensaje, 'error');
        }
      },
      error => {
        console.log('Error al anular el Ticket', error);
      }
    );
    this.cerrarModal();
  }

  cerrarModal(): void {
    this.modal.close();
  }
}
