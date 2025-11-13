import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {Subscription} from "rxjs";
import {
  FormularioEncuesta,
} from "../../../shared/models/formulario-encuesta";

import { Cliente } from 'src/app/shared/models/cliente';
import { FormControl, Validators } from '@angular/forms';
import {DatePipe} from "@angular/common";
import {CryptoService} from "../../../shared/services/crypto.service";
import {CONFIG} from "../../../shared/configuracion/config";
import {UtilsService} from "../../../shared/services/funciones/utils.service";

import {RSede} from "../../../shared/interfaces/Response/sede";
import {SedeService} from "../../../shared/services/sede.service";
import {UsuarioService} from "../../../shared/services/usuario.service";


@Component({
  selector: 'app-cliente-encuesta-link',
  templateUrl: './cliente-encuesta-link.component.html',
  styleUrls: ['./cliente-encuesta-link.component.scss']
})
export class ClienteEncuestaLinkComponent implements OnInit, OnDestroy {

  @Input() modal: NgbModalRef;
  @Input() formularios: FormularioEncuesta[] = [];
  @Input() cliente: Cliente | null;

  // Subscripciones
  subscription: Subscription;
  subscriptionForm : Subscription;

  subscriptionSede: Subscription;


  resultado: FormControl;
  fecha: FormControl;
  formulario: FormControl;

  idSede: FormControl;
  cryptoKey: string;

  sedes: RSede[] = [];

  constructor(
    private datePipe: DatePipe,
    private cryptoService: CryptoService,
    private utilService: UtilsService,
    private sedeService: SedeService,
    private usuarioService: UsuarioService
  ) {
    this.formulario = new FormControl(0, Validators.required);
    this.resultado = new FormControl('');
    this.fecha = new FormControl(null, Validators.required);

    this.idSede = new FormControl(0, Validators.required);

    this.cryptoKey = CONFIG.cryptoKey;
  }

  ngOnInit(): void {
    //console.log( 'formularios', this.formularios );

    this.obtenerSedes();
  }

  ngOnDestroy(): void {
    if( this.subscription ){ this.subscription.unsubscribe() }
    if( this.subscriptionForm  ){ this.subscriptionForm.unsubscribe() }
    if( this.subscriptionSede ){ this.subscriptionSede.unsubscribe() }
  }

  /**
   * Modal options
   */
  cerrarModal( result: any = null): void {
    this.modal.close(result);
  }

  seleccionarFormulario(): void{

      const id = parseInt(this.formulario.value,10);

      if(id){
        const fecha = new Date(this.fecha.value+" 00:00:00");

        if(this.fecha.value) {

          const cryptoId = this.cryptoService.set(id, this.cliente.id);
          const cryptoIdCliente = this.cryptoService.set(this.cryptoKey, this.cliente.id);
          const cryptoDate = this.cryptoService.set(this.cryptoKey, this.datePipe.transform(fecha, 'yyyy-MM-dd'));

          const idUsuario = this.usuarioService.UsuarioActual.idUsuario;

          this.resultado.patchValue(`https://link-cliente.depilzone.com.pe/Encuesta/${this.cliente.id}/${id}/${this.datePipe.transform(fecha, 'yyyy-MM-dd')}/${this.idSede.value}/${idUsuario}`);

          // this.resultado.patchValue(`http://localhost:4200/Encuesta/${this.cliente.id}/${id}/${this.datePipe.transform(fecha, 'yyyy-MM-dd')}`);
        }

      }else{
        this.resultado.patchValue('');
        this.fecha.patchValue(null);
      }

  }

  async onSubmit(): Promise<void>{

    if(this.formulario.valid && this.fecha.valid && this.idSede.valid){

      const apiWhatsapp = `https://wa.me/51${this.cliente.telefono1}?text=${this.resultado.value.trim()}`;
      window.open(apiWhatsapp, '_blank');
    }else{
      this.utilService.mostrarToast('Ingresar todos los valores','warning');
    }
  }



  // Get data
  obtenerSedes(): void{
    this.subscriptionSede = this.sedeService.obtener().subscribe((res: any[]) => {
      const collection : RSede[] = [];
      res.forEach((r) => {
        const sede = {
          id: r.idSede,
          nombre: r.nombre
        }
        collection.push(sede);
      });
      this.sedes = collection;
    }, error => {
      console.log(error);
    })
  }


}
