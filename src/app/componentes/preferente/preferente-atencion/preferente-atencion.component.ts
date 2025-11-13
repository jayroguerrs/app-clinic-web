import {Component, OnInit, Input, OnDestroy, AfterViewInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { EstadoService } from '../../../shared/services/estado.service';
import { PreferenteService } from '../../../shared/services/preferente.service';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { Preferente } from '../preferente.models';
import { Router } from '@angular/router';
import { ImportExportDataService } from '../../../shared/services/import-export-data.service';
import {ErrorSistema} from "../../../shared/models/error-sistema";
import {Subscription} from "rxjs";
import {MdlAgendarCitaComponent} from "../../modals/mdl-agendar-cita/mdl-agendar-cita.component";
import {PreferenteEstadoAtencion} from "../../../shared/enumeracion/enums";
import {PreferenteAtencionCategoriaService} from "../../../shared/services/preferente-atencion-categoria.service";
import {PreferenteAtencionOpcionService} from "../../../shared/services/preferente-atencion-opcion.service";
import {PreferenteAtencionCategoria, PreferenteAtencionOpcion} from "../../../shared/models/preferente.model";
import {catchError} from "rxjs/operators";
import { ZonaCorporalService } from 'src/app/shared/services/zona-corporal.service';
import { PromocionZonaService } from 'src/app/shared/services/promocionZona.services';

@Component({
  selector: 'app-preferente-atencion',
  templateUrl: './preferente-atencion.component.html',
  styleUrls: ['./preferente-atencion.component.scss']
})
export class PreferenteAtencionComponent implements OnInit, OnDestroy, AfterViewInit {
  frmAtencion: FormGroup;
  @Input() modal: NgbModalRef;
  @Input() idPreferente: number;
  @Input() preferente: Preferente | null = null;
  maestroEstadoAtendido: any = [];
  hijoEstadoAtendido: any = [];
  lstZonaServicio: any = [];
  lstZonaPromocion: any = [];
  sbcAtendiendo: Subscription | undefined;
  modalRef: NgbModalRef | undefined;
  subscripcions: Subscription[] = [];
  categorias: PreferenteAtencionCategoria[] = [];
  opciones: PreferenteAtencionOpcion[] = [];
  ldCategorias: boolean;
  ldOpciones: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private estadoService: EstadoService,
    private preferenteService: PreferenteService,
    private utilsService: UtilsService,
    private router: Router,
    private importExportDataService: ImportExportDataService,
    private modalService: NgbModal,
    private preferentAtCatService: PreferenteAtencionCategoriaService,
    private preferentAtOpcService: PreferenteAtencionOpcionService,
    private zonaServicioService: ZonaCorporalService,
    private zonaPromocionService: PromocionZonaService
  ) {
    this.ldCategorias = false;
    this.ldOpciones = false;
  }
  ngOnInit(): void {
    // this.obtenerCategorias();
    this.inicializarFormulario();
    this.estadoAtendidoListar();
    this.atendiendoPreferente(this.idPreferente, 0);
    this.onZonaServicio();
  }
  ngAfterViewInit(): void {
  }
  ngOnDestroy(): void {
    this.sbcAtendiendo?.unsubscribe();
    this.atendiendoPreferente(this.idPreferente, 1);
    this.modalRef?.hidden;
  }
  inicializarFormulario(): void {
    this.frmAtencion = this.formBuilder.group({
      idEstAtenPadr: ['', Validators.required],
      idEstAtenHijo: ['', Validators.required],
      idZona: [null],
      idPromocion: [null],
      txtComentario: [''],      
    });    
  }
  cerrarModal(): void {
    this.modal.close();
  }
  preferenteAtendido(): void {
    const model = new Preferente();
    model.idEstadoAtencion = parseInt(this.frmAtencion.controls.idEstAtenHijo.value);

    const param = {
      "Id": this.idPreferente,
      "IdEstadoPadre": parseInt(this.frmAtencion.controls.idEstAtenPadr.value),
      "IdEstadoAtencion": parseInt(this.frmAtencion.controls.idEstAtenHijo.value),
      "Promocion": this.frmAtencion.controls.idPromocion.value ? this.frmAtencion.controls.idPromocion.value.toString() : '',
      "IdAtencionOpcion": this.frmAtencion.controls.idZona.value ? parseInt(this.frmAtencion.controls.idZona.value) : 0,
      "Comentario": this.frmAtencion.controls.txtComentario.value
    };             
    
    this.preferenteService.preferenteAtendidoNew(param).subscribe(
      resultado => {
        if(resultado.exito) {
          this.utilsService.mostrarToast(resultado.mensaje, 'success');
          this.cerrarModal();

          //llevar los datos del preferente al cliente por medio de servicio
          let numero1 = '';
          let numero2 = '';
          if(resultado.response.preferenteTelefono != null ){
            const telefonos = resultado.response.preferenteTelefono;
            if(telefonos.length == 1) {
              numero1 = telefonos[0].numero.replaceAll(' ', '')
            }
            if(telefonos.length == 2) {
              numero1 = telefonos[0].numero.replaceAll(' ', '')
              numero2 = telefonos[1].numero.replaceAll(' ', '')
            }
          }
          const preferenteCliente = {
            nombres: resultado.response.nombres,
            apellidos: resultado.response.apellidos,
            email: resultado.response.email,
            numero1,
            numero2,
            medioContacto: resultado.response.idMedioContacto,
            direccion: resultado.response.direccion,
            id: resultado.response.id
          };
          // console.log(preferenteCliente);

          this.importExportDataService.preferenteClienteExport(preferenteCliente);

          if(model.idEstadoAtencion === PreferenteEstadoAtencion.Agendo){
            if(this.preferente?.esCliente){

              this.modalRef = this.modalService.open(MdlAgendarCitaComponent,{size: 'xl', backdrop: "static", windowClass: 'smodal fade round popins bg-dark-30', keyboard: false, backdropClass: 'bg-transparent', animation: true});
              this.modalRef.componentInstance.idCliente = this.preferente.idCliente;
              this.modalRef.componentInstance.idPreferente = this.preferente.id;
              this.modalRef.componentInstance.esPreferente = true;

              // this.router.navigate([]).then(() => { window.open('ClientePerfil/' + this.preferente.idCliente, '_blank'); });
            }else{
              //mostrar ventana de listado de cliente.
              this.router.navigate(['Cliente', 0]).then(() => { });
            }
          }




        } else {
          this.utilsService.mostrarToast(resultado.mensaje, 'error');
        }
      },
      error => console.log('Error al actualizar el estado de atención del preferente', error)
    );
  }
  estadoAtendidoListar(): void{
    // Preferente2    
    this.estadoService.obtenerEstadoByEntidad('PrefPadre').subscribe(
      resultado => this.maestroEstadoAtendido = resultado,
      error => console.log('Error al obtener los estado de atención', error));
  }
  estadoAtendidoHijoListar(): void{    
    const param = {
      "entidad": 'Preferente2',
      "idEstPadr": this.frmAtencion.controls.idEstAtenPadr.value
    }
    this.estadoService.obtenerEstadoByEntidadHijo(param).subscribe(
      resultado => this.hijoEstadoAtendido = resultado,
      error => console.log('Error al obtener los estado', error));  
  }
  // onValidateEstado() :void{
  //   debugger;
  //   var IdEstado = this.frmAtencion.controls.idEstAtenPadr.value;    

  //   if(IdEstado === "73" || IdEstado === "74"){
  //     this.frmAtencion.get('idZona').setValidators(Validators.required);
  //     this.frmAtencion.get('idPromocion').setValidators(Validators.required);      
  //   }
  //   else{
  //     this.frmAtencion.controls.idZona.setValue(null);
  //     this.frmAtencion.controls.idPromocion.setValue(null);
  //     this.frmAtencion.get('idZona').clearAsyncValidators();
  //     this.frmAtencion.get('idPromocion').clearAsyncValidators();      
  //   }    
  //   this.frmAtencion.get('idZona').updateValueAndValidity();
  //   this.frmAtencion.get('idPromocion').updateValueAndValidity();

  //   console.log('idZona validators:', this.frmAtencion.get('idZona').validator);
  //   console.log('idPromocion validators:', this.frmAtencion.get('idPromocion').validator);
  //   console.log('idZona value:', this.frmAtencion.get('idZona').value);
  //   console.log('idPromocion value:', this.frmAtencion.get('idPromocion').value);
  // } 
  onZonaServicio() :void{    
    this.zonaServicioService.obtenerListadoZonaServicio().subscribe(
      resultado => {        
        this.lstZonaServicio = resultado;
      },
      error => console.log('Error al obtener zona Servicio', error));
  }
  listadoZonaPromocion():void {    
    this.zonaPromocionService.obtenerByZonasCorporales(this.frmAtencion.controls.idZona.value).subscribe(
      (res) => {        
        this.lstZonaPromocion = res;
      },
      (error) => {
        console.log('Error al obtener zona promocion', error);        
      }
    )
  }
  // Functions
  atendiendoPreferente(idPreferente: number, termino: number): void{
    this.sbcAtendiendo = this.preferenteService.atendiendoPreferente(idPreferente, termino).subscribe((res: boolean | ErrorSistema) => {
      if(res instanceof  ErrorSistema){
        console.log(res.message);
      }
    }, error => {
      console.log('Ocurrio un error al ir atendiendo el preferente');
    });
  }
  /*********************************************************************************************
   * Data
   */
  obtenerCategorias(): void{
    this.ldCategorias = true;
    const subs = this.preferentAtCatService.listar().subscribe((v: PreferenteAtencionCategoria[] | ErrorSistema) => {
      if(v instanceof ErrorSistema){
        this.utilsService.mostrarToast(v.message, 'error');
      }else{
        this.categorias = v;
      }
      this.ldCategorias = false;
    }, error => {
      this.utilsService.mostrarToast('Ocurrio un error al intentar obtener las categorias', 'error');
      this.ldCategorias = false;
    });
  }
  obtenerOpcionesPorCategoria(idCategoria: number): void{
    this.ldOpciones = true;
    const subs = this.preferentAtOpcService.listarByCategoria(idCategoria).subscribe((v: PreferenteAtencionOpcion[] | ErrorSistema) => {
      if(v instanceof ErrorSistema){
        this.utilsService.mostrarToast(v.message, 'error');
      }else{
        this.opciones = v;
      }
      this.ldOpciones = false;
    }, error => {
      this.utilsService.mostrarToast('Ocurrio un error al intentar obtener las opciones', 'error');
      this.ldOpciones = false;
    });
  }
  // Eventos
  onEstadoChange():void{
    // this.onValidateEstado();    
    if(this.frmAtencion.controls.idEstAtenPadr.value){
      this.estadoAtendidoHijoListar();
      // this.frmAtencion.controls.idZona.setValue("");
      // this.frmAtencion.controls.idPromocion.setValue("");
    }
  }
  onZonaPromocionChange():void{
   
    this.frmAtencion.controls.idPromocion.setValue(null);

    if(this.frmAtencion.controls.idZona.value){
      this.listadoZonaPromocion();
    }
  }
}