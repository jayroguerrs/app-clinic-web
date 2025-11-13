import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from 'src/app/shared/models/usuario';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { EgresoService } from '../../../shared/services/egreso.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { DatePipe } from '@angular/common';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { CajaService } from '../../../shared/services/caja.service';

@Component({
  selector: 'app-caja-egreso-datos',
  templateUrl: './caja-egreso-datos.component.html',
  styleUrls: ['./caja-egreso-datos.component.scss'],
  providers: [DatePipe]
})
export class CajaEgresoDatosComponent implements OnInit {
  @Input() idEgreso: number = 0;
  @Input() idCaja: number = 0;
  @Input() modal: NgbModalRef;
  @Output() eventoEgresoListar: EventEmitter<boolean> = new EventEmitter<boolean>();

  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';
  frmEgresoDatos: FormGroup;
  accion: string = ''
  usuarioActual: Usuario;
  options = { prefix: 'S/ ', thousands: '', decimal: '.', inputMode: CurrencyMaskInputMode.NATURAL }

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private egresoService:EgresoService,
    private spinner: NgxSpinnerService,
    private cajaService: CajaService,
    private utilsService: UtilsService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.usuarioActual = this.usuarioService.UsuarioActual;
    $('#btnImprimir').hide();
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.frmEgresoDatos = this.formBuilder.group({
      cajaEgreso: [this.usuarioActual.sede],
      fechaEgreso: [new Date()],
      montoEgreso: [0],
      beneficiarioEgreso: [''],
      conceptoEgreso: [''],
      observacionEgreso: ['']
    });
    const date = new Date();
    this.frmEgresoDatos.patchValue({
      fechaEgreso:  this.datePipe.transform(date, 'yyyy-MM-dd'),
    });
  }
  get egreso(): any {

    if(this.monto() == 0) {
      this.utilsService.mostrarToast('El monto de egreso debe ser mayor a 0', 'error');
      return null;
    }

    if(this.frmEgresoDatos.controls.conceptoEgreso.value.trim() == '')
    {
      this.utilsService.mostrarToast('Debe ingresar el concepto de egreso', 'error');
      return null;
    }

    if(this.frmEgresoDatos.controls.beneficiarioEgreso.value.trim() == '')
    {
      this.utilsService.mostrarToast('Debe ingresar el nombre del beneficiario', 'error');
      return null;
    }


    const egreso = {
      monto: this.monto(),
      idCaja: this.idCaja,
      fechaStr: this.utilsService.formato_FechaHoraUniversalSQL(new Date()),
      idSede: this.usuarioActual.idSede,
      concepto: this.frmEgresoDatos.controls.conceptoEgreso.value,
      observacion: this.frmEgresoDatos.controls.observacionEgreso.value,
      beneficiario: this.frmEgresoDatos.controls.beneficiarioEgreso.value,
      usuarioRegistra: this.usuarioActual.nombre
    };
    return egreso;
  }

  monto(): number{
    let monto = 0;
    let montoSplit = this.frmEgresoDatos.controls.montoEgreso.value.toString();
    montoSplit = montoSplit.split(' ');
    if(montoSplit.length == 2) {
      monto = Number(montoSplit[1]);
    } else {
      monto = Number(montoSplit[0]);
    }
    return monto;
  }
  imprimirEgreso(): void {
    const documentDefinition = this.getTicketEstructura();
    pdfMake.createPdf(documentDefinition).print();
  }
  getTicketEstructura(): any {
    const lineaSeparacion = '------------------------------------------------------------------------------------------';
    const dd: any = {
      content: [
        { text: 'TICKET DE EGRESO',       bold: true,   fontSize: 10,     margin: [0, 5, 0, 0],   alignment: 'center',    style: 'name'      },
        { text: lineaSeparacion,                            bold: false,  fontSize: 8,      margin: [0, 2, 0, 0],   alignment: 'center',    style: 'name'      },
        { 
          widths: [100, 50],
          columns : 
          [
                { text: 'FECHA:',      fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],   alignment: 'left' },
                { text: this.frmEgresoDatos.controls.fechaEgreso.value,  fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],     alignment: 'right' },
          ]
        },
        { 
          widths: [100, 50],
          columns : 
          [
                { text: 'SEDE:',       fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],     alignment: 'left' },
                { text: this.usuarioActual.sede, fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],     alignment: 'right' },
          ]
        },
        { text: lineaSeparacion,                            bold: false,  fontSize: 8,      margin: [0, 2, 0, 0],   alignment: 'center',    style: 'name'      },
        { text: 'DETALLE DE EGRESO',       bold: true,   fontSize: 10,     margin: [0, 5, 0, 0],   alignment: 'center',    style: 'name'      },
        { text: lineaSeparacion,                            bold: false,  fontSize: 8,      margin: [0, 2, 0, 0],   alignment: 'center',    style: 'name'      },
        { columns : 
          [
                { text: 'MONTO:',      fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],   alignment: 'left' },
                { text: 'S/',  fontSize: 8,  bold: false,  margin: [0, 2, 0, 0], alignment: 'right' },
                { text: this.frmEgresoDatos.controls.montoEgreso.value.toFixed(2).toString(),       fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],     alignment: 'right' },
          ]
        },
        { 
          widths: [100, 50],
          columns : 
          [
                { text: 'ENTREGADO POR:',       fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],     alignment: 'left' },
                { text: this.usuarioActual.nombre, fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],     alignment: 'right' },
          ]
        },
        { 
          widths: [100, 50],
          columns : 
          [
                { text: 'RECIBIDO POR:',       fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],     alignment: 'left' },
                { text: this.frmEgresoDatos.controls.beneficiarioEgreso.value, fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],     alignment: 'right' },
          ]
        },
        { 
          widths: [100, 50],
          columns : 
          [
                { text: 'CONCEPTO:',       fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],     alignment: 'left' },
                { text: this.frmEgresoDatos.controls.conceptoEgreso.value, fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],     alignment: 'right' },
          ]
        },
        { columns : 
          [
                { text: 'FECHA IMPRESIÓN:',  fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],      alignment: 'left' },
                { text: this.utilsService.formato_FechaFullString(new Date(), '-', ':'),    fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],      alignment: 'right' },
          ]
        }
      ],
      styles: {
        header: {
          fontSize: 8,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 8,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 0, 0, 0]
        },
        tableHeader: {
          bold: true,
          fontSize: 8,
          color: 'black',
          margin: [0, 0, 0, 0]
        },
        tableBody: {
          fontSize: 8,
          color: 'black',
          margin: [0, 0, 0, 0]
        },
        name: {
          fontSize: 8,
          bold: true,
          alignment: 'center',
          margin: [0, 20, 0, 10],
        }
      },
      defaultStyle: {
      },
      pageMargins: [5,5,5,0],
      pageSize: { height: 300,  width: 210  }
    }
    return dd;
  }

  egresoGrabar(): void {
    // const idCaja;
    // const fechaCaja:
    const fecha = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.cajaService.verificarEstadoCaja(this.idCaja, fecha).subscribe(
      resultado => {
        if(resultado == 1) {
          this.grabar();
        } else {
          this.utilsService.mostrarToast('Caja se encuentra cerrada, imposible realizar egreso', 'warning');
        }
      },
      error => {}
    );
    
  }
  grabar(): void {
    this.egresoService.guardar(this.egreso).subscribe(
      resultado => {
        if(resultado.exito) {
          Swal.fire(resultado.mensaje).then((result) => this.eventoEgresoListar.emit(true) );
          this.spinner.hide();

          $('#btnGrabar').hide();
          $('#txtMonto').prop('disabled', true);
          $('#txtBeneficiario').prop('disabled', true);
          $('#txtConcepto').prop('disabled', true);
          $('#txtObservacion').prop('disabled', true);
          $('#btnImprimir').show();

        } else {
          this.utilsService.mostrarToast(resultado.mensaje + ': ' + resultado.errorDetalle, 'error');
          this.spinner.hide();
        }
      },
      error => {
        console.log('Error al actualizar al cliente', error);
        this.spinner.hide();
      }
    );
  }

  cerrarModal(): void {
    this.modal.close();
  }
}
