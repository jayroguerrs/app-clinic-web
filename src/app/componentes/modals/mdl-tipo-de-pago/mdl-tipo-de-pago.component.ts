import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { TipoDePagoColor } from '../../../shared/enumeracion/enums';

@Component({
  selector: 'app-mdl-tipo-de-pago',
  templateUrl: './mdl-tipo-de-pago.component.html',
  styleUrls: ['./mdl-tipo-de-pago.component.scss']
})
export class MdlTipoDePagoComponent implements OnInit {
  montoFinal: string;
  paciente: string;
  enabled = true;
  tipoDePago: number;
  titulo: string;
  
  modalRef: NgbModalRef | undefined;
  
  @Input() modal: MatDialogRef<MdlTipoDePagoComponent>;
  @Input() data: any;
  @Input() tipoDePagoCita: any;
  @Input() precioDePagoFinalCita: any;

  constructor(
    public utilsService: UtilsService,
  ) { }

  ngOnInit(): void {
    this.configurarDatosDeCita();
    this.montoFinal = this.data.montoFinal || this.data.cita.montoInicial;
    this.paciente = this.data.paciente;  
    this.setTitulo();
  }

  configurarDatosDeCita(){;
    if(this.tipoDePagoCita){
      this.tipoDePago = this.tipoDePagoCita;
    }

    if(this.precioDePagoFinalCita){
      this.montoFinal = this.precioDePagoFinalCita;
    }
    
  }

  onNoClick(output: boolean = false): void {
    this.modal.close(output);
  }

  elegirTipopago(tipoDePago: number){
    this.enabled = true;
    this.tipoDePago = tipoDePago;
    this.setTitulo();
  }

  confirmarPago(): void {
    if(!this.tipoDePago){
      this.utilsService.mostrarToast('Elija un tipo de Pago', 'error');
      return;
    }

    const colorObj = TipoDePagoColor.find(tipo => tipo.id === this.tipoDePago);
    const color = colorObj ? colorObj.nombre : '#04a9f5'; // Color por defecto si no encuentra

    const resultado = {
      montoFinal: this.montoFinal,
      tipoDePago: this.tipoDePago,
      titulo: this.titulo,
      color: color
    };
    
    this.modal.close(resultado);
  }

  setTitulo(): void {
    switch (this.tipoDePago) {
      case 1:
        this.titulo = 'ADELANTO';
        break;
      case 2:
        this.titulo = 'PAGO TOTAL';
        break;
      case 3:
        this.titulo = 'PAGARÁ EN SEDE';
        break;
    }
  }

}
