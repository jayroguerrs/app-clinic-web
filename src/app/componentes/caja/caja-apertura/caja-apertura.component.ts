import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { CajaService } from '../../../shared/services/caja.service';
import { UtilsService } from '../../../shared/services/funciones/utils.service';

@Component({
  selector: 'app-caja-apertura',
  templateUrl: './caja-apertura.component.html',
  styleUrls: ['./caja-apertura.component.scss'],
  providers: [DatePipe]
})
export class CajaAperturaComponent implements OnInit {
  @Input() modal: NgbModalRef;
  @Input() cajaDiario: any;
  frmCajaApertura: FormGroup;
  options = { prefix: 'S/ ', thousands: '', decimal: '.', inputMode: CurrencyMaskInputMode.NATURAL }

  turnos: any[] = [
    {id: 1, nombre: "Turno 1"},
    {id: 2, nombre: "Turno 2"},
    {id: 3, nombre: "Turno 3"},
  ]


  constructor(
    private formBuilder: FormBuilder,
    private cajaService: CajaService,
    private utilsService: UtilsService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.frmCajaApertura = this.formBuilder.group({
      descripcion: [''],
      fechaApertura: null,
      saldoInicial: [0.00],
      turno: 1,
    });

    this.frmCajaApertura.patchValue({
      descripcion: this.cajaDiario.descripcion,
      fechaApertura: this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    });
  }
  cerrarModal(): void {
    this.modal.close();
  }
  cajaApertura(): void {
    let saldoInicial = this.frmCajaApertura.controls.saldoInicial.value.toString();
    const saldoInicialSplit = saldoInicial.split(' ');
    if(saldoInicialSplit.length == 2) saldoInicial = parseFloat(saldoInicialSplit[1]);
    else saldoInicial = parseFloat(saldoInicialSplit[0]);

    this.cajaDiario.saldoInicial = saldoInicial;
    this.cajaDiario.turno = parseInt( this.f.turno.value, 10 );
    this.cajaDiario.fechaHoraAperturaStr = this.utilsService.formato_FechaHoraUniversalSQL(new Date());

    this.cajaService.abrirCerrar(this.cajaDiario).subscribe(
      resultado => {
        if (resultado.exito) {
          this.utilsService.mostrarToast(resultado.mensaje, 'success');
          this.cerrarModal();
        } else {
          this.utilsService.mostrarToast(resultado.mensaje, 'error');
        }
      },
      error => console.log("Error al abrir o cerrar la caja", error)
    );
  }

  /*************************************************************************************
   * Getter
   */
  get f(): any{
    return this.frmCajaApertura.controls;
  }
}
