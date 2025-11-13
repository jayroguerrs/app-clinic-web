import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {Subscription} from "rxjs";
import {
  FormularioEncuesta,
  FormularioEncuestaOpcion,
  FormularioEncuestaPregunta,
  FormularioEncuestaRespuesta, FormularioRespuesta
} from "../../../shared/models/formulario-encuesta";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {FormularioEncuestaService} from "../../../shared/services/formulario-encuesta.service";
import {UsuarioService} from "../../../shared/services/usuario.service";
import {NgxSpinnerService} from "ngx-spinner";

import Swal from "sweetalert2";

import {SedeService} from "../../../shared/services/sede.service";
import { RSede } from 'src/app/shared/interfaces/Response/sede';
import { FormControl } from '@angular/forms';
import {ClienteEncuestaVerComponent} from "../cliente-encuesta-ver/cliente-encuesta-ver.component";
import { AutocompleteOption, AutocompleteSelectionEvent } from '../../../shared/components/autocomplete-select/autocomplete-select.interface';


@Component({
  selector: 'app-cliente-encuesta',
  templateUrl: './cliente-encuesta.component.html',
  styleUrls: ['./cliente-encuesta.component.scss']
})
export class ClienteEncuestaComponent implements OnInit, OnDestroy {

  @Input() modal: NgbModalRef;
  // @Input() formularios: FormularioEncuesta[] = [];

  @Input() idCliente: number | null;

  // Subscripciones
  subscription: Subscription;
  subscriptionForm : Subscription;
  subscriptionSede: Subscription;
  subscriptionCollection: Subscription;

  idSede: FormControl;

  formularios : FormularioEncuesta[] = [];
  formulario: FormularioEncuesta | null = null;
  respuestas: FormularioRespuesta[] = [];
  sedes: RSede[] = [];
  submitted = false;

  // Formularios realizados
  sbcFormulariosRealizados: Subscription;
  loadingRealizados = false;
  buscarFormularios = false;
  formularioRealizados: FormularioEncuestaRespuesta[] = [];

  constructor(
    private util: UtilsService,
    private formularioEncuestaService: FormularioEncuestaService,
    private usuarioService: UsuarioService,
    private sedeService: SedeService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal
  ) {
    this.idSede = new FormControl(0);
  }

  ngOnInit(): void {
    //console.log( 'formularios', this.formularios );
    this.obtenerSedes();
    this.obtenerFormularioListado();
  }

  ngOnDestroy(): void {
    if(this.subscription){ this.subscription.unsubscribe(); }
    if(this.subscriptionForm){ this.subscriptionForm.unsubscribe(); }

    if(this.subscriptionSede){ this.subscriptionSede.unsubscribe(); }
    if(this.subscriptionCollection){ this.subscriptionCollection.unsubscribe(); }

  }

  /**
   * Modal options
   */
  cerrarModal( result: any = null): void {
    this.modal.close(result);
  }


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

  mostrarFormulario(event): void{
    const idFormulario = parseInt(event.target.value, 10);
    if(!idFormulario){
      this.util.mostrarToast('Seleccionar un formulario','warning');
      return;
    }

    this.subscription = this.formularioEncuestaService.obtenerById(idFormulario).subscribe( (res) => {
      this.formulario = res;
      this.respuestas = this.createPreguntas([...this.formulario.preguntas]);
    }, error => {
      console.log(error);
    });


    this.buscarFormularios = true;
    this.loadingRealizados = true;
    this.sbcFormulariosRealizados = this.formularioEncuestaService.obtenerListadoByClienteFormulario(idFormulario, this.idCliente).subscribe((res) => {
      console.log(res,'realizados');
      this.formularioRealizados = res;
      this.loadingRealizados = false;
    }, error => {
      console.log(error);
      this.loadingRealizados = false;
    });
  }

  obtenerFormularioListado(): void{
    this.subscriptionCollection = this.formularioEncuestaService.obtenerListadoByCliente(1, this.idCliente).subscribe((res) => {
      this.formularios = res;
    }, error => {
      console.log(error);
    });
  }




  async onSubmit(): Promise<void>{

    const obligatorios = this.formulario.preguntas.filter(p => p.obligatorio );
    let error: boolean = false;


    if( !parseInt(this.idSede.value,10) ){
      error = true;
    }

    obligatorios.forEach(  x => {

      const respuesta = this.respuestas.find(r => r.idPregunta === x.id);

      if(respuesta.tipo === 'checkbox' || respuesta.tipo === 'radio'){
        if(!respuesta.idRespuesta) {
          this.util.mostrarToast('Faltan respuestas por responder','warning');
          error = true;
          return;
        }
      }
      else if(respuesta.tipo === 'textarea'){
        if( !respuesta.respuestaTexto || respuesta.respuestaTexto === ''){
          this.util.mostrarToast('Faltan respuestas por responder','warning');
          error = true;
          return;
        }
      }

    });

    if(error){
      return;
    }


    Swal.fire({
      title: 'Registrar encuesta?',
      html: '¿Desea registrar la encuesta realizada?',
      icon: 'question',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: true,
      confirmButtonText: 'Si',
      showCancelButton: true,
      cancelButtonText: 'No',
    }).then(
      result => {
        if(result.isConfirmed) {

          this.spinner.show();
          this.formularioEncuestaService.registrarEncuesta(this.model).subscribe((res) => {

            Swal.fire({
              icon: 'success',
              title: 'Encuesta registrada!!!',
              html: `La encuesta se realizo con exito.`,
              showConfirmButton: true
            });

          }, error => {
            Swal.fire({
              icon: 'error',
              title: 'Encuesta no registrada!!!',
              html: `Ocurrio un error al registrar la encuesta, favor de intentarlo nuevamente o comunicarse con el administrador del sistema.`,
              showConfirmButton: true
            });
            console.log(error)
          }, () => {
            this.spinner.hide();
            this.modal.close();
          });

        }
      }
    );


  }

  // Functions

  createPreguntas( preguntas: FormularioEncuestaPregunta[] ): FormularioRespuesta[]{

    const respuestas: FormularioRespuesta[] = [];

    preguntas.forEach( async (preg) => {
      const respuesta = new FormularioRespuesta();
      respuesta.idPregunta = preg.id;
      respuesta.tipo = preg.tipoRespuesta;
      respuestas.push(respuesta);
    });

    return respuestas;
  }

  toggleAdicional(idPregunta: number, opcion: FormularioEncuestaOpcion): void{
    const respuesta = this.respuestas.find( r => r.idPregunta === idPregunta);
    respuesta.idRespuesta = opcion.id;
    respuesta.adicional = opcion.adicional;
  }

  insertText(idPregunta: number, event): void{
    this.respuestas.find( r => r.idPregunta === idPregunta).respuestaTexto = event.target.value;
  }


  insertValueSelect(pregunta: FormularioEncuestaPregunta, event: string | string[], opciones: FormularioEncuestaOpcion[]): void{

    if(pregunta.multiple){
      if(event instanceof Array){

        if(event.length){
          const ids = event.map( e => parseInt(e,10)).join(",");
          this.respuestas.find( r => r.idPregunta === pregunta.id).idRespuestas = (ids == '' ? null : ids) ;
          this.respuestas.find( r => r.idPregunta === pregunta.id).respuestaTexto = opciones.filter((o) =>  event.map( e => parseInt(e,10)).includes(o.id) ).map( o => o.valor).join(",");
        }else{
          this.respuestas.find( r => r.idPregunta === pregunta.id).idRespuestas = null;
          this.respuestas.find( r => r.idPregunta === pregunta.id).respuestaTexto = null;
        }

      }
    }else{
        this.respuestas.find( r => r.idPregunta === pregunta.id).idRespuesta = parseInt(event.toString(),10);
        this.respuestas.find( r => r.idPregunta === pregunta.id).respuestaTexto = opciones.find( o => o.id === parseInt(event.toString(),10)).valor;
    }
    // this.respuestas.find( r => r.idPregunta === pregunta.id).idRespuesta = parseInt(event.target.value,10);
    // this.respuestas.find( r => r.idPregunta === pregunta.id).respuestaTexto = opciones.find( o => o.id === parseInt(event.target.value,10)).valor;

  }

  insertAdicional(idPregunta: number, event): void{
    this.respuestas.find( r => r.idPregunta === idPregunta).respuestaAdicional = event.target.value;
  }


  faltaResponder(idPregunta: number, pregunta: FormularioEncuestaPregunta): boolean {
    const respuesta = this.respuestas.find( r => r.idPregunta === idPregunta);

    if( pregunta.tipoRespuesta === 'checkbox' || pregunta.tipoRespuesta === 'radio' ){
      // Si no ah seleccionado ninguna opcion
      if(respuesta.idRespuesta === 0 ){
        return false;
      }
      // Si tiene adicional pero no respondio
      if( (respuesta.adicional && !respuesta.respuestaAdicional) || (respuesta.adicional && respuesta.respuestaAdicional === '') ){
        return false;
      }
    }

    // if( pregunta.tipoRespuesta === 'textarea'){
    //   if( (!respuesta.respuestaTexto && respuesta.respuestaAdicional === '')  ){
    //     return false;
    //   }
    // }

    return true;
  }
  mostrarAdicional(idPregunta: number, opcionId: number): boolean{
    if(this.respuestas.length){
      const pregunta = this.respuestas.find(x => x.idPregunta === idPregunta);
      if(pregunta.adicional && pregunta.idRespuesta === opcionId){
        return true;
      }
      return false;
    }
    return false;
  }


  getMultiPleData(opciones: FormularioEncuestaOpcion[], multiple: boolean): AutocompleteOption[]{
    const output : AutocompleteOption[] = [];
    if(!multiple){
      output.push({
        id: 0,
        text: '--Seleccionar--'
      });
    }

    opciones.map((o) => {
      output.push({
        id: o.id,
        text: o.valor
      });
    });
    return output;
  }

  onEncuestaSelectionChanged(event: AutocompleteSelectionEvent, pregunta: FormularioEncuestaPregunta, opciones: FormularioEncuestaOpcion[]): void {
    // Convertir el evento a formato compatible con el método existente
    if (pregunta.multiple && event.allSelected) {
      const selectedIds = event.allSelected.map(option => option.id.toString());
      this.insertValueSelect(pregunta, selectedIds, opciones);
    } else if (event.option) {
      this.insertValueSelect(pregunta, event.option.id.toString(), opciones);
    }
  }


  // Getters
  get model(): FormularioEncuestaRespuesta{
    const formularioRespuesta: FormularioEncuestaRespuesta = new FormularioEncuestaRespuesta();
    formularioRespuesta.idCliente = this.idCliente;

    formularioRespuesta.idSede = parseInt( this.idSede.value, 10 );
    formularioRespuesta.idFormulario = this.formulario.id;
    formularioRespuesta.respuestas = this.respuestas.map( r => {
      if( r.idRespuestas === '' ){
        r.idRespuestas = null;
      }
      return r;
    });

    formularioRespuesta.idUsuarioRegistro = this.usuarioService.UsuarioActual.idUsuario;

    return formularioRespuesta;
  }

  verFormularioRealizado( idFormulario: number, fecha: Date ): void{
    this.formularioEncuestaService.buscarReporte(idFormulario).subscribe((res) => {
      console.log(res);
      const modal = this.modalService.open(ClienteEncuestaVerComponent,{});
      modal.componentInstance.fecha = fecha;
      modal.componentInstance.formularioPreguntas = res;
    }, error => {
      console.log(error);
    });
  }

}
