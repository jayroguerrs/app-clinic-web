import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { NgbModalRef, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { zonashorarios } from 'src/app/shared/models/zonashorarios';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { PromocionZonaService } from '../../../shared/services/promocionZona.services';
import {CitaImportClass, ZonaCorporalClass} from 'src/app/shared/models/cita';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { Usuario } from '../../../shared/models';
import { AccionCita, EnumServicio } from 'src/app/shared/enumeracion/enums';
import {ZonaCorporalService} from "../../../shared/services/zona-corporal.service";
import {Zona, ZonaTratamiento} from 'src/app/shared/models/zonas';
import {ZonaSesionTratamientoService} from "../../../shared/services/zona-sesion-tratamiento.service";
import {Subscription} from "rxjs";
import {ErrorSistema} from "../../../shared/models/error-sistema";
import { EditarZonaService } from '../cita-registro/editar-zona.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-cita-zona-corporal',
  templateUrl: './cita-zona-corporal.component.html',
  styleUrls: ['./cita-zona-corporal.component.scss']
})
export class CitaZonaCorporalComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() modal: NgbModalRef | undefined;
  @Input() errorHorario: boolean;
  @Input() maestroZonasCorporales: any;
  @Input() datosCita: CitaImportClass;
  @Output() pintarAgenda = new EventEmitter<any>();
  @Input() idServicio: number = 0;
  @Input() servicio: string = '';

  @Output() eventoCalcularTotalNieto = new EventEmitter<void>();
  @Output() cerrarModalHorarioAlEditar = new EventEmitter<void>();
  @Output() ordenarCitaDetallesNieto = new EventEmitter<void>();

  

  @Output() eventoObtenerDuplicado = new EventEmitter<void>();

  //Variables Dual List
  format: any = { add: 'Añadir', remove: 'Eliminar', all: 'Todos', none: 'Ninguno', direction: 'left-to-right', draggable: true, locale: 'es-PE' };
  disabled = false;
  keepSorted = true;
  source: Array<any>;
  confirmed: Array<any>;
  key: string;
  display: any;
  filter = true;

  horaTermino: Date;
  zonasSeleccionadas: any[] = [];
  promocionesPorZonas = [];
  horariofinal= null;
  zonahorarios = new zonashorarios('', '', 0);
  formatoHoraInicio = 'HH:mm';
  formatoFecha = 'dd-MM-yyyy';
  usuarioActual: Usuario

  zonas: Zona[] = [];

  subscriptions: Subscription[] = [];

  //Zonas anteriores de Confirmar Zona
  zonasAnteriores: ZonaCorporalClass[] = [];

  editarZona: boolean
  formatEdit: any = { add: 'Cambiar', remove: 'Eliminar', all: 'Todos', none: 'Ninguno', direction: 'left-to-right', draggable: true, locale: 'es-PE' };
  zonaAnteriorEditar: any
  zonasHabilitadasEditar: any[] = [];

  constructor(
    public parserFormatter: NgbDateParserFormatter,
    private utilsService: UtilsService,
    private promocionZonaService: PromocionZonaService,
    private usuarioService: UsuarioService,
    private api: ZonaCorporalService,
    private zonaSesionTratamientoService: ZonaSesionTratamientoService,

    private editarZonaService: EditarZonaService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    
    this.zonasAnteriores = this.datosCita.zonasCorporales;
    
    this.usuarioActual = this.usuarioService.UsuarioActual;

    this.listarZonas(true);

    this.editarZona = this.editarZonaService.editarZona;

  }

  ngAfterViewInit(): void {}

  ngOnDestroy() {
    this.subscriptions.forEach(x => {
      x.unsubscribe();
    });
  }

  cerrarModal(): void {
    if(this.editarZona){
      this.cerrarModalHorarioAlEditar.emit();
    }
    this.modal.close();
  }
  doResetnew() {
    this.maestroZonasCorporales.forEach(element => {
      element.idPromocion = 0;
      element.precio = 0;
      element.idZona = element.id;
      delete element.id;
    });

    this.zonasSeleccionadas = [];
    this.zonasHabilitadasEditar = [];

    if(this.datosCita.accionCita == AccionCita.VER) {
      this.disabled = false;
    }

    let duracionTemp = 0;
    this.horaTermino = this.datosCita.horaInicio;
    if(this.datosCita.zonasCorporales != undefined) {

      if(!this.editarZona){
        this.datosCita.zonasCorporales.forEach(
          (e: any) => {
            this.zonasSeleccionadas.push(this.maestroZonasCorporales.find(m => m.idZona == e.idZona && e.estado === true && e.duplicado === false))
            if(e.estado === true && e.duplicado === false){
              duracionTemp = duracionTemp + parseInt(e.duracion, 10);
  
            }
          }
        );
      } else{
        this.datosCita.zonasCorporales.forEach(
          (e: any) => {
            const zonaEncontrada = this.maestroZonasCorporales.find(m => m.idZona == e.idZona && e.estado === true && e.id !== this.editarZonaService.id && e.duplicado === false);
            //this.zonasHabilitadasEditar.push(this.maestroZonasCorporales.find(m => m.idZona == e.idZona && e.estado === true && e.id !== this.editarZonaService.id))
            if(zonaEncontrada){
              this.zonasHabilitadasEditar.push(zonaEncontrada);
            }
            if(e.estado === true && e.duplicado === false){
              duracionTemp = duracionTemp + parseInt(e.duracion, 10);
            }
          }
        );
        //const maestroZonasCorporalesParaEditar =  JSON.parse(JSON.stringify(this.maestroZonasCorporales));
        const indexZonaEditar = this.maestroZonasCorporales.findIndex(m => m.idZona === this.editarZonaService.idZona);
        this.zonasSeleccionadas.push(this.maestroZonasCorporales[indexZonaEditar]);
      }


      this.zonahorarios.duracion = duracionTemp;
      this.horaTermino = this.utilsService.sumarMinutosAsDate(this.datosCita.horaInicio, this.zonahorarios.duracion);
    }

    this.key = 'idZona';
    this.display = this.stationLabel;
    this.keepSorted = true;

    if(this.editarZona){
      
      this.source = this.maestroZonasCorporales.filter((zona: any) => {
        return !this.datosCita.zonasCorporales.some((zonaExistente: any) => 
          //zona.idZona === zonaExistente.idZona && zonaExistente.estado === true
          zona.idZona === zonaExistente.idZona
        );
      });

      this.source.push(this.zonasSeleccionadas[0]);
      this.zonaAnteriorEditar = this.zonasSeleccionadas[0];
    }else{
      this.source = this.maestroZonasCorporales

    }
    //this.source = this.maestroZonasCorporales;
    this.confirmed = this.zonasSeleccionadas;

    //Estilo del dual List
    // $('.record-picker').addClass('fuente');
    $('[name=addBtn]').addClass('btn-sm');
    $('[name=removeBtn]').addClass('btn-sm');
    // $('[name=filterSource]').css({"height": "20px"});
    // $('[name=filterDestination]').addClass('btn-sm');
    $('.button-bar button').addClass('btn-sm');
    $('.button-bar button').css({'margin': '0', 'display': 'none'});
    $('.pull-right').addClass('btn-danger');
  }
  stationLabel(resp) {
    return resp.descripcion + ' - (' + resp.duracion + ' min.)';
  }

  // onSubmit confirmar zonas seleccionadas
  confirmarZonasCorporales(): void{
    if(this.errorHorario) {
      this.utilsService.mostrarToast('Existe cruce de horario por favor verifique', 'info');
      return;
    }
    //VALIDAR QUE TENGA ZONAS SELECCIONADAS
    if(this.zonasSeleccionadas.length == 0){
      this.utilsService.mostrarToast('Seleccione al menos una zona corporal', 'info');
      return;
    }

    //OBTENER LAS PROMOCIONES VINCULADAS A LAS ZONAS SELECCIONADAS
    const idsZonasCorporales = this.zonasSeleccionadas.map(t => t.idZona).join(',');
    const subs = this.promocionZonaService.obtenerByZonasCorporales(idsZonasCorporales).subscribe(
      async (resultado: any[]) => {
        this.promocionesPorZonas = resultado;

         //guardar los datos preexistentes

         //Codigo Anterior
         //const citaZonasAnteriorTemp = this.datosCita.zonasCorporales;
         //Codigo Nuevo
         const citaZonasAnteriorTemp =  JSON.parse(JSON.stringify(this.datosCita.zonasCorporales));
        //Asignar las promociones existentes a cada zona seleccionada
        await this.zonasSeleccionadas.forEach( (zonaCorporal, index) => {
          zonaCorporal.promociones = this.promocionesPorZonas.filter( p =>  p.idZona == zonaCorporal.idZona);
          zonaCorporal.peso =  index
        });

        //Asignar la promocion asignada pero que ya no se encuentra activada
        await this.zonasSeleccionadas.forEach( (zonaActual) => {
            if(!citaZonasAnteriorTemp){return;}
            const zonaAnterior = citaZonasAnteriorTemp.find( (zona) => zona.idZona === zonaActual.idZona );

            if ( !zonaAnterior ){
              return;
            }
            const promocionAnterior = zonaAnterior.promociones.find( (promocion) => promocion.idPromocionPrecio === zonaAnterior.idPromocionPrecio );
            // Verificar si existe en la nueva lista
            const buscarPromocion = zonaActual.promociones.find( (promocion) => promocion.idPromocionPrecio === zonaAnterior.idPromocionPrecio);
            // Si no se encuentra, agregarlo
            if(!buscarPromocion){
              zonaActual.promociones.push(promocionAnterior);
            }
        });
        
        const zonasSeleccionadasConEstadoHabilitado = this.zonasSeleccionadas.map((zona) => {
          return {
            ...zona,
            duplicado: false,
            estado: true
          }
        })

        if(this.datosCita.zonasCorporales){
          zonasSeleccionadasConEstadoHabilitado.forEach((zona: any) => {

            // Verificar si la zona ya existe usando `some()`
            const existe = this.datosCita.zonasCorporales.findIndex((zonaExistente: any) => zonaExistente.idZona === zona.idZona) !== -1;
            const existeUnDeshabilitadoEnZonaSeleccionada = this.datosCita.zonasCorporales.findIndex((zonaExistente: any) => zonaExistente.idZona === zona.idZona && zonaExistente.estado === false);

            const MasDeUnaZonaActiva = this.datosCita.zonasCorporales.filter((zonaExistente: any) => zonaExistente.idZona === zona.idZona && zonaExistente.estado === true);

            //? ESTO ES UNA FUNCIONALIDAD PARA EL DESCUENTO - SI PASA MAS DE 1 MES INHABILITADO BORRARLO
            // const indexParaHabilitarSoloZonasDeUsuariosConLaMismaZona = this.datosCita.zonasCorporales.findIndex((zonaExistente: any) => zonaExistente.idZona === zona.idZona && zonaExistente.idUsuarioAgendado !== this.usuarioActual.idUsuario && zonaExistente.estado === true);
            // console.log("======================= entro zona", indexParaHabilitarSoloZonasDeUsuariosConLaMismaZona)
            // if(indexParaHabilitarSoloZonasDeUsuariosConLaMismaZona !== -1){
            //   this.datosCita.zonasCorporales[indexParaHabilitarSoloZonasDeUsuariosConLaMismaZona].estado = false;
            // }

            const indexParaHabilitarSoloZonasDeUsuarioActual = this.datosCita.zonasCorporales.findIndex((zonaExistente: any) => zonaExistente.idZona === zona.idZona && zonaExistente.idUsuarioAgendado === this.usuarioActual.idUsuario && zonaExistente.duplicado === false);

            if(indexParaHabilitarSoloZonasDeUsuarioActual !== -1 && this.datosCita.zonasCorporales[indexParaHabilitarSoloZonasDeUsuarioActual].idUsuarioAgendado === this.usuarioActual.idUsuario && MasDeUnaZonaActiva.length === 0){
              this.datosCita.zonasCorporales[indexParaHabilitarSoloZonasDeUsuarioActual].estado = true;
            } 
            else if (existeUnDeshabilitadoEnZonaSeleccionada !== -1 && indexParaHabilitarSoloZonasDeUsuarioActual === -1 && MasDeUnaZonaActiva.length === 0){
              zona.idUsuarioAgendado =  this.usuarioActual.idUsuario;
              zona.usuarioAgendado =  this.usuarioActual.nombre;
              this.datosCita.zonasCorporales.unshift(zona);

              const index = this.datosCita.zonasCorporales.findIndex(z => z.idZona === zona.idZona && z.duplicado === true);

              if(index !== -1){
                const zonaDuplicada = this.datosCita.zonasCorporales[index];
                this.datosCita.zonasCorporales.splice(index, 1); 
                this.datosCita.zonasCorporales.splice(0 + 1, 0, zonaDuplicada);
              }

              //this.eventoObtenerDuplicado.emit({indexZona: this.datosCita.zonasCorporales.length - 1, idZona: zona.idZona});
            }

            if (!existe) {
              // Si no existe, agregar la zona
              this.datosCita.zonasCorporales.unshift(zona);
            }
          });

          //desactiva la zona si lo elimina del modal
          this.datosCita.zonasCorporales.forEach((zona: any, index) => {
            const indexParaHabilitarSoloZonasDeUsuarioActual = this.datosCita.zonasCorporales.findIndex((zonaExistente: any) => zonaExistente.idZona === zona.idZona && zonaExistente.estado === false && zonaExistente.idUsuarioAgendado === this.usuarioActual.idUsuario);

            const existe = zonasSeleccionadasConEstadoHabilitado.findIndex((zonaExistente: any) => zonaExistente.idZona === zona.idZona) !== -1;
            if (!existe) {
              // Si no existe, eliminar la zona
              zona.estado = false;

              this.datosCita.zonasCorporales.push(zona);
              this.datosCita.zonasCorporales.splice(index, 1); 

              const indexDuplicado = this.datosCita.zonasCorporales.findIndex(z => z.idZona === zona.idZona && z.duplicado === true);
              if (indexDuplicado !== -1) {
                this.datosCita.zonasCorporales[indexDuplicado].verDuplicado = true;
                const zonaDuplicada = this.datosCita.zonasCorporales[indexDuplicado];
            
                if(zonaDuplicada !== undefined){
                  this.datosCita.zonasCorporales.splice(indexDuplicado, 1); 
                  this.datosCita.zonasCorporales.push(zonaDuplicada);
              }}
            }
          })

        } else{
          this.datosCita.zonasCorporales = zonasSeleccionadasConEstadoHabilitado;
        }

        this.eventoCalcularTotalNieto.emit();
        
        await this.actualizarZonasSeleccionadas(citaZonasAnteriorTemp);
        

        if(this.datosCita.idServicio === EnumServicio.TratamientoFacial){
          await this.obtenerTratamientosZonas();
        }

        this.modal.close();
      },
      (error: any) => {
        console.log('Error al obteler las promociones por zonas corporales', error);
        this.utilsService.mostrarToast('Error al procesar la información, intente mas tarde o consulte con soporte técnico', 'info');
      }
    );
    this.subscriptions.push(subs);
  }

  async actualizarZonasSeleccionadas(citaZonasAnteriorTemp): Promise<void> {
    const citaZonasConIdUsuario =  JSON.parse(JSON.stringify(this.datosCita.zonasCorporales));
    //setear los usuarios agendados nuevamente
    for(var i = 0; i < this.datosCita.zonasCorporales.length; i++) {
      let usuarioAgendadoTemp;
      let idUsuarioAgendadoTemp;
      let idPromocionPrecioSelecTemp;
      let precioTemp;
      let sesionTemp;

      let pagoWeb = false;
      let retroTratam = false;
      let precioDescuento = 0;
      let idMedioContactoOrigen = 0;
      let id = 0;

      if(!citaZonasConIdUsuario[i].duplicado && citaZonasConIdUsuario[i].estado){
        if(citaZonasAnteriorTemp == null) {
          // nueva cita nunca tendra usuario agendado, asignar el usuario actual
          idUsuarioAgendadoTemp = this.usuarioActual.idUsuario;
          usuarioAgendadoTemp = this.usuarioActual.nombre;
          precioTemp = 0;
          sesionTemp = 1;
  
        } else {
          const zonaTemp = citaZonasAnteriorTemp.find(iz => iz.idZona == this.datosCita.zonasCorporales[i].idZona);
          const zonaConUsuarioAnterior = citaZonasAnteriorTemp.find(iz => iz.usuarioAgendado == this.usuarioActual.nombre);
          if(zonaTemp == undefined){
            // en caso si se agrego nueva zonasCorporales
            usuarioAgendadoTemp = this.usuarioActual.nombre;
            idUsuarioAgendadoTemp = this.usuarioActual.idUsuario;
            precioTemp = 0;
            sesionTemp = 1;
          } 
          //?
          else if(citaZonasConIdUsuario[i].idUsuarioAgendado){
            id = citaZonasConIdUsuario[i].id;
            usuarioAgendadoTemp = citaZonasConIdUsuario[i].usuarioAgendado;
            idUsuarioAgendadoTemp = citaZonasConIdUsuario[i].idUsuarioAgendado;
            idPromocionPrecioSelecTemp = citaZonasConIdUsuario[i].idPromocionPrecio;
            precioTemp = citaZonasConIdUsuario[i].precio;
            sesionTemp = citaZonasConIdUsuario[i].sesion;
            pagoWeb = citaZonasConIdUsuario[i].pagoWeb;
            retroTratam = citaZonasConIdUsuario[i].retroTratam;
            precioDescuento = citaZonasConIdUsuario[i].precioDescuento;
            idMedioContactoOrigen = citaZonasConIdUsuario[i].idMedioContactoOrigen;
            pagoWeb =  !citaZonasConIdUsuario[i].pagoWeb ? false : true;
            retroTratam = !citaZonasConIdUsuario[i].retroTratam ? false : true;
          }
          //?
          else {
            usuarioAgendadoTemp = zonaTemp.usuarioAgendado;
            idUsuarioAgendadoTemp = zonaTemp.idUsuarioAgendado;
            idPromocionPrecioSelecTemp =  zonaTemp.idPromocionPrecio;
            precioTemp =  zonaTemp.precio;
            sesionTemp = zonaTemp.sesion;
            pagoWeb = zonaTemp.pagoWeb;
            retroTratam = zonaTemp.retroTratam;
            precioDescuento = zonaTemp.precioDescuento;
            idMedioContactoOrigen = zonaTemp.idMedioContactoOrigen;
            id = zonaTemp.id;
          }
        }
        this.datosCita.zonasCorporales[i].id = id;
        this.datosCita.zonasCorporales[i].idUsuarioAgendado = idUsuarioAgendadoTemp;
        this.datosCita.zonasCorporales[i].idUsuarioAgendadoStr = this.datosCita.zonasCorporales[i].idUsuarioAgendado ? this.datosCita.zonasCorporales[i].idUsuarioAgendado.toString() : "";
  
        this.datosCita.zonasCorporales[i].idPromocionPrecio = idPromocionPrecioSelecTemp;
        this.datosCita.zonasCorporales[i].usuarioAgendado = usuarioAgendadoTemp ? usuarioAgendadoTemp : "";
        this.datosCita.zonasCorporales[i].precio = precioTemp;
        this.datosCita.zonasCorporales[i].sesion = sesionTemp;
        this.datosCita.zonasCorporales[i].pagoWeb = pagoWeb;
        this.datosCita.zonasCorporales[i].retroTratam = retroTratam;
        this.datosCita.zonasCorporales[i].precioDescuento = precioDescuento;
        this.datosCita.zonasCorporales[i].idMedioContactoOrigen = idMedioContactoOrigen;
      }

    }
    this.datosCita.horaTermino = this.horaTermino;
    this.datosCita.duracion = this.zonahorarios.duracion;
    this.datosCita.modificado = true;
    this.ordenarCitaDetallesNieto.emit();
    // console.log('Datos zonas corporales actualizados', this.datosCita.zonasCorporales);
  }

  editarZonaSeleccionada(){


    if(this.errorHorario) {
      this.utilsService.mostrarToast('Existe cruce de horario por favor verifique', 'info');
      return;
    }
    //VALIDAR QUE TENGA ZONAS SELECCIONADAS
    if(this.zonasSeleccionadas[0] === undefined){
      this.utilsService.mostrarToast('Seleccione una zona corporal', 'info');
      return;
    }

    this.spinner.show();
    const subs = this.promocionZonaService.obtenerByZonasCorporales(String(this.zonasSeleccionadas[0].idZona)).subscribe(
      async (resultado: any[]) => {
        this.promocionesPorZonas = resultado;

        await this.zonasSeleccionadas.forEach( (zonaCorporal, index) => {
          //this.zonasSeleccionadas[0].promociones = this.promocionesPorZonas.filter( p =>  p.idZona == zonaCorporal.idZona);
          zonaCorporal.promociones = this.promocionesPorZonas.filter( p =>  p.idZona == zonaCorporal.idZona);
        });
        
        //Asignar la promocion asignada pero que ya no se encuentra activada
        await this.zonasSeleccionadas.forEach( (zonaActual) => {
            if(!this.zonaAnteriorEditar){return;}
            //const zonaAnterior = citaZonasAnteriorTemp.find( (zona) => zona.idZona === zonaActual.idZona );
            const zonaAnterior = this.zonaAnteriorEditar.idZona === this.zonasSeleccionadas[0].idZona ? this.zonaAnteriorEditar : null;

            if ( !zonaAnterior ){
              return;
            }
            const promocionAnterior = zonaAnterior.promociones.find( (promocion) => promocion.idPromocionPrecio === zonaAnterior.idPromocionPrecio );
            // Verificar si existe en la nueva lista
            const buscarPromocion = zonaActual.promociones.find( (promocion) => promocion.idPromocionPrecio === zonaAnterior.idPromocionPrecio);
            // Si no se encuentra, agregarlo
            if(!buscarPromocion){
              zonaActual.promociones.push(promocionAnterior);
            }
        });

        const indexDeLaZonaAEditar = this.datosCita.zonasCorporales.findIndex((z: any) => z.estado === true && z.idZona === this.zonaAnteriorEditar.idZona);
        if(this.zonasSeleccionadas[0].idZona !== this.datosCita.zonasCorporales[indexDeLaZonaAEditar].idZona){
              this.datosCita.zonasCorporales.forEach(zona => {
                if (zona.idZona === this.datosCita.zonasCorporales[indexDeLaZonaAEditar].idZona && zona.duplicado) {
                  zona.precio = 0;
                  zona.precioDescuento = 0;
                  zona.idZona = this.zonasSeleccionadas[0].idZona;
                  zona.duracion = 0;
                  zona.descripcion = this.zonasSeleccionadas[0].descripcion;
                  zona.idPromocionPrecio = 0;
                  zona.promociones = this.zonasSeleccionadas[0].promociones;
                  zona['modificado'] = true;
                }
              });
              this.datosCita.zonasCorporales[indexDeLaZonaAEditar].precio = this.zonasSeleccionadas[0].precio;
              this.datosCita.zonasCorporales[indexDeLaZonaAEditar].precioDescuento = 0;
              this.datosCita.zonasCorporales[indexDeLaZonaAEditar].idZona = this.zonasSeleccionadas[0].idZona;
              this.datosCita.zonasCorporales[indexDeLaZonaAEditar].duracion = this.zonasSeleccionadas[0].duracion;
              this.datosCita.zonasCorporales[indexDeLaZonaAEditar].descripcion = this.zonasSeleccionadas[0].descripcion;
              this.datosCita.zonasCorporales[indexDeLaZonaAEditar].idPromocionPrecio = 0;
              this.datosCita.zonasCorporales[indexDeLaZonaAEditar].promociones = this.zonasSeleccionadas[0].promociones;
              this.datosCita.zonasCorporales[indexDeLaZonaAEditar]['modificado'] = true;

              const descuentosAplica = this.datosCita.descuentoAplicaA ?  this.datosCita.descuentoAplicaA.split(",").map(x => parseInt(x)) : [];
              this.datosCita.descuentoAplicaA = descuentosAplica.filter(x => x != this.datosCita.zonasCorporales[indexDeLaZonaAEditar].idZona ).join(","); 

        }

        this.eventoCalcularTotalNieto.emit();
        this.modal.close();
        
        this.cerrarModalHorarioAlEditar.emit();
        this.spinner.hide();
      },
      (error: any) => {
        
        this.cerrarModalHorarioAlEditar.emit();
        this.spinner.hide();
        console.log('Error al obteler las promociones por zonas corporales', error);
        this.utilsService.mostrarToast('Error al procesar la información, intente mas tarde o consulte con soporte técnico', 'info');
      })

    this.subscriptions.push(subs);

    this.datosCita.horaTermino = this.horaTermino;
    this.datosCita.duracion = this.zonahorarios.duracion;
    this.datosCita.modificado = true;


  }

  async obtenerTratamientosZonas(): Promise<void> {

    if(this.datosCita.zonasCorporales.length > 0){

      await this.datosCita.zonasCorporales.forEach((z: ZonaCorporalClass, i: number) => {
        const subs = this.zonaSesionTratamientoService.tratamientosByZonaSesion(this.usuarioActual.idUsuario, z.idZona, z.sesion).subscribe((res: ZonaTratamiento[] | ErrorSistema) => {
          if(res instanceof ErrorSistema){
            this.utilsService.mostrarToast(res.message,'error');
          }else{
            this.datosCita.zonasCorporales[i].tratamientos = res;
            console.log(res);
          }
        }, error => {
          console.log('Ocurrio un error');
        })
        this.subscriptions.push(subs);
      });

    }

  }

  confirmarEditarZonaCorporal(destinationData){
          // Seleccionar zonas trigger ( Añadir, Eliminar )
    if(this.editarZona){
      
  

      if(destinationData.length === 1){
        this.zonasSeleccionadas = this.confirmed;
        this.calcularTiempoEditar(this.zonasHabilitadasEditar);
        return;
      }
      this.confirmed = [destinationData[1]];
      this.zonasSeleccionadas = this.confirmed;
      this.calcularTiempoEditar(this.zonasHabilitadasEditar);

      if(destinationData.length > 1){
        return;
      }
      //this.confirmed.push(destinationData[destinationData.length - 1]);

    } 
  }

  confirmarZonaCorporal(destinationData){
      if (destinationData.length > 0) {
        // console.log('destinationData', destinationData);
        // console.log('citasConfirmadas', this.confirmed);
        this.zonasSeleccionadas = this.confirmed;
        this.zonahorarios.duracion = destinationData.reduce((accumulator, currentValue) => accumulator + currentValue.duracion, 0);
        this.horaTermino = this.utilsService.sumarMinutosAsDate(this.datosCita.horaInicio, this.zonahorarios.duracion);
  
        // permite pintar la agenda con las horas seleccionada a traves de un evento
        const pintarAgendaPorSeleccionZC = {
          idCita: this.datosCita.idCita,
          idUsuario: this.usuarioActual.idUsuario,
          duracion: this.zonahorarios.duracion,
          horaInicio: this.datosCita.horaInicio,
          minutoInicio: this.utilsService.totalDeMinutos(this.datosCita.horaInicio),
          minutoTermino: this.utilsService.totalDeMinutos(this.datosCita.horaInicio) + this.zonahorarios.duracion
        };

        this.pintarAgenda.emit(pintarAgendaPorSeleccionZC);
      } else {
        this.zonasSeleccionadas = [];
        this.zonahorarios.duracion = 0;
        this.horaTermino = this.datosCita.horaInicio;
      }
  }

  // data
  listarZonas( init = false ): void{
    const subs = this.api.obtenerListadoPorServicio(this.idServicio).subscribe(res => {
      this.zonas = res;
      if(init){
        this.maestroZonasCorporales = this.zonas;
      }
      this.doResetnew();
    }, error => {
      console.log(error);
    });
    this.subscriptions.push(subs);
  }

  calcularTiempoEditar(todosLosDatos){
    if(this.zonasSeleccionadas[0] === undefined){
      return;
    }
    
    todosLosDatos.push(this.zonasSeleccionadas[0]);
    this.zonahorarios.duracion = todosLosDatos.reduce((accumulator, currentValue) => accumulator + currentValue.duracion, 0); 
    this.horaTermino = this.utilsService.sumarMinutosAsDate(this.datosCita.horaInicio, this.zonahorarios.duracion);

    // permite pintar la agenda con las horas seleccionada a traves de un evento
    const pintarAgendaPorSeleccionZC = {
      idCita: this.datosCita.idCita,
      idUsuario: this.usuarioActual.idUsuario,
      duracion: this.zonahorarios.duracion,
      horaInicio: this.datosCita.horaInicio,
      minutoInicio: this.utilsService.totalDeMinutos(this.datosCita.horaInicio),
      minutoTermino: this.utilsService.totalDeMinutos(this.datosCita.horaInicio) + this.zonahorarios.duracion
    };
    this.pintarAgenda.emit(pintarAgendaPorSeleccionZC);
  }
}
