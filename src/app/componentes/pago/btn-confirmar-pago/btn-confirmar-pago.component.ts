import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlDeCitasService } from '../../../shared/services/control-de-citas.service';
import { Usuario } from '../../../shared/models';
import { UsuarioService } from '../../../shared/services/usuario.service';

@Component({
  selector: 'app-btn-confirmar-pago',
  templateUrl: './btn-confirmar-pago.component.html',
  styleUrls: ['./btn-confirmar-pago.component.scss']
})
export class BtnConfirmarPagoComponent implements OnInit {

  usuarioActual: Usuario;
  
  @Input() element: any;
  // @Input() esMobile: boolean;
  @Input() nombreClienteElegido: string;
  @Input() botonTipo: string;

  @Output() pagoFinalSuccess = new EventEmitter<object>();

  constructor(
    private controlDeCitasService: ControlDeCitasService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.usuarioActual = this.usuarioService.UsuarioActual;
  }

  openModalConfirm(idCita: number, precioNeto: number, precioDePagoFinal: any, tipoPago: number | null = null): void {
    this.controlDeCitasService.abrirMdlTipoDePago(idCita, this.nombreClienteElegido, precioDePagoFinal != null ? precioDePagoFinal : precioNeto, tipoPago, precioDePagoFinal)
    .subscribe(result => {
      if (result) {
        this.controlDeCitasService
          .updatePayment(idCita, result.montoFinal, this.usuarioActual.idUsuario, result.tipoDePago)
          .subscribe((res: any) => {
            if (res.status !== 200) return;

            this.pagoFinalSuccess.emit({idCita, result});
            this.controlDeCitasService.mostrarSuccesPaymentToast(false);
          })

      }
    })
  }
}
