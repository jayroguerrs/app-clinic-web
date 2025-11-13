import { DatePipe } from '@angular/common';
import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { CajaService } from '../../../shared/services/caja.service';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../../shared/services/auth.service";
import {ComprobanteElectronicoDatos} from "../../../shared/models/facturacion/comprobante-electronico";

@Component({
  selector: 'app-caja-cierre',
  templateUrl: './caja-cierre.component.html',
  styleUrls: ['./caja-cierre.component.scss'],
  providers: [DatePipe]
})
export class CajaCierreComponent implements OnInit, AfterViewInit, OnDestroy {

  @Output() OnUpdated : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() cajaDiario: any;
  formGroup: FormGroup;
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
    private activeModal: NgbActiveModal,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {

  }

  inicializarFormulario(): void {
    this.formGroup = this.formBuilder.group({
      descripcion: [''],
      fechaCierre: null,
      saldoFinal: [0.00],
      turno: this.cajaDiario.turno,
    });

    this.formGroup.patchValue({
      descripcion: this.cajaDiario.descripcion,
      fechaCierre: this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    });
  }







  cerrarModal(): void {
    this.activeModal.close();
  }
  cajaApertura(): void {
    let saldoInicial = this.formGroup.controls.saldoInicial.value.toString();
    const saldoInicialSplit = saldoInicial.split(' ');
    if(saldoInicialSplit.length == 2) saldoInicial = parseFloat(saldoInicialSplit[1]);
    else saldoInicial = parseFloat(saldoInicialSplit[0]);

    this.cajaDiario.saldoInicial = saldoInicial;
    this.cajaDiario.turno = parseInt( this.f.turno.value, 10 );
    this.cajaDiario.fechaHoraAperturaStr = this.utilsService.formato_FechaHoraUniversalSQL(new Date());

    this.cajaService.abrirCerrar(this.model).subscribe(
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
    return this.formGroup.controls;
  }

  get model(): any{
    return{
      id: this.cajaDiario.id,
      abrirCaja: false,
      idUsuarioResponsable: this.auth.getUser().id,
      fechaHoraAperturaStr: this.utilsService.formato_FechaHoraUniversalSQL(new Date()),
      saldoInicial: parseFloat(this.f.saldoFinal.value),
      turno: parseInt(this.f.turno.value, 10)
    }
  }



  /*************************************************************************************
   * Events
   */
  evtOnSubmit(): void{
    if(this.formGroup.invalid){
      this.utilsService.mostrarToast('Faltan ingresar datos', 'warning');
      return;
    }

    this.cajaService.abrirCerrar(this.model).subscribe(
      resultado => {
        if (resultado.exito) {
          this.utilsService.mostrarToast(resultado.mensaje, 'success');
          this.OnUpdated.emit(true);
          this.cerrarModal();
        } else {
          this.utilsService.mostrarToast(resultado.mensaje, 'error');
        }
      },
      error => console.log("Error al abrir o cerrar la caja", error)
    );
  }
}
