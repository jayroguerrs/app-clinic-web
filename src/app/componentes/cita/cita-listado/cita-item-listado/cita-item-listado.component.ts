import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { CitaEstado } from '../../../../shared/enumeracion/enums';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Cita } from '../../../../shared/interfaces/Cita';
import { ControlDeCitasService } from '../../../../shared/services/control-de-citas.service';
import { Usuario } from '../../../../shared/models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cita-item-listado',
  templateUrl: './cita-item-listado.component.html',
  styleUrls: ['./cita-item-listado.component.scss'],
})
export class CitaItemListadoComponent implements OnInit {
  montoFinal: number = 0;
  name: string;
  perfilUsuario: any;

  @Input() cita: Cita;
  @Input() idPerfil: number;
  @Input() usuarioActual: Usuario;
  @Output() OnCitaSelected: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private controlDeCitasService: ControlDeCitasService
  ) {}

  ngOnInit(): void {}

  citaSeleccionar(cita): void {
    this.OnCitaSelected.emit(cita);
    $('[cita-id]').removeClass('selected');
    $('[cita-id= ' + cita.idCita + ']').addClass('selected');
    $('#btnReprogramar1, #btnReprogramar2, #btnAtender1, #btnAtender2').show();

    cita.pagado
      ? $('#btnComprobante1, #btnComprobante2').hide()
      : $('#btnComprobante1, #btnComprobante2').show();
    cita.pagado
      ? $('#btnImpTicket1, #btnImpTicket2').show()
      : $('#btnImpTicket1, #btnImpTicket2').hide();

    if (cita.estado.toUpperCase() == CitaEstado[CitaEstado.ATENDIDA]) {
      $(
        '#btnReprogramar1, #btnReprogramar2, #btnAtender1, #btnAtender2'
      ).hide();
    }
  }

  enviarNotificacionDePago(){
    this.controlDeCitasService.enviarNotificaionDePago(this.usuarioActual.idUsuario, this.cita.idSede, this.usuarioActual.nombre, this.cita.idCita).subscribe((resp : any) => {
      if(resp.status === 201){
        Swal.mixin({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
          background: '#FFFFBB'
        }).fire({
          title: 'Se envió la notificación correctamente!',
          icon: 'success' 
        });
      } else{
        Swal.mixin({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 2900,
          timerProgressBar: true,
          background: '#FFFFBB'
        }).fire({
          title: resp.message,
          icon: 'error' 
        });
      }
      
    });
  }

  obtenerImagenPaciente(idGenero: number): string {
    let rutaImagen = '';
    switch (idGenero) {
      case 1: {
        rutaImagen = '../../../../assets/images/avatar/avatar-m.png';
        break;
      }
      case 2: {
        rutaImagen = '../../../../assets/images/avatar/avatar-f.png';
        break;
      }
      case 3: {
        rutaImagen = '../../../../assets/images/avatar/avatar-t.png';
        break;
      }
      default: {
        rutaImagen = '../../../../assets/images/avatar/avatar-n.png';
        break;
      }
    }
    return rutaImagen;
  }

  mostrarPerfil(idCliente): void {
    this.router.navigate([]).then((result) => {
      window.open('ClientePerfil/' + idCliente, '_blank');
    });
  }

  openModalConfirm(cita: Cita): void {
    const sendData = {
      idCita: cita.idCita,
      paciente: cita.paciente,
      montoInicial: cita.total,
    };

    const dialogRef = this.dialog.open(DialogContentExampleDialog, {
      width: '430px',
      data: {
        cita: sendData,
        montoFinal: 0,
        paciente: cita.paciente,
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result !== undefined && result >= 0) {

        this.montoFinal = result;

        this.controlDeCitasService
          .updatePayment(cita.idCita, this.montoFinal, this.usuarioActual.idUsuario)
          .subscribe((res: any) => {
            if (res.status !== 200) return;

            this.cita.colorEstado = '#00e7ff';
            this.cita.estado = 'PAGADO';
            this.cita.pagoFinal = this.montoFinal;
            this.cita.precioDePagoFinal = this.montoFinal;
          });
      }
    });
  }
}

@Component({
  selector: 'dialog-content-example-dialog',
  styleUrls: ['./cita-item-listado.component.scss'],
  template: `
    <h1 mat-dialog-title class="text-center m-0">
      CONFIRMAR PAGO FINAL DE CITA
    </h1>
    <h6 class="custom-text">
      {{ data.paciente }} : Código de Cita {{ data.cita.idCita }}
    </h6>

    <span class="mySubtitle mb-3">
      <h6>Monto inical del Contrato</h6>
      <h3>S/. {{ data.cita.montoInicial }}</h3></span
    >

    <mat-dialog-content class="mat-typography">
      <section class="content-dialog m-0">
        <mat-form-field appearance="fill">
          <mat-label>Monto Final S/.</mat-label>
          <input [disabled]="!enabled" matInput [(ngModel)]="montoFinal" />
          <mat-hint align="start">¿Desea cambiar el monto final? </mat-hint>
        </mat-form-field>
        <mat-checkbox
          class="example-margin"
          [(ngModel)]="enabled"
        ></mat-checkbox>
      </section>
    </mat-dialog-content>

    <mat-dialog-actions class="mt-3" align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button
        class="bg-primary"
        mat-button
        [mat-dialog-close]="enabled ? montoFinal : data.cita.montoInicial"
        cdkFocusInitial
      >
        Guardar Monto Final
      </button>
    </mat-dialog-actions>
  `,
})
export class DialogContentExampleDialog {
  montoFinal: string;
  paciente: string;
  enabled = false;

  constructor(
    public dialogRef: MatDialogRef<DialogContentExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.montoFinal = data.montoFinal || data.cita.montoInicial; // Valor inicial del monto
    this.paciente = data.paciente;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
