import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Inject, PLATFORM_ID, NgZone} from '@angular/core';

import {ReportesService} from '../../../shared/services/reportes-service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UtilsService} from '../../../shared/services/funciones/utils.service';

import {NgxSpinnerService} from "ngx-spinner";
import { DatePipe } from '@angular/common';
import {SedeService} from "../../../shared/services/sede.service";
import {Subscription} from "rxjs";
import {RSede} from "../../../shared/interfaces/Response/sede";

import {UsuarioService} from "../../../shared/services/usuario.service";
import {TblCitaReporteComponent} from "./tbl-cita-reporte/tbl-cita-reporte.component";
import {EstadoService} from "../../../shared/services/estado.service";
import {TipoCitaService} from "../../../shared/services/tipo-cita.services";
import {ServicioService} from "../../../shared/services/servicio.service";
import {Servicio} from "../../../shared/models/servicio";
import {CitaReporte} from "../../../shared/models/cita";
import {CitaEstado, TipoPerfil} from '../../../shared/enumeracion/enums';
import {animate, AUTO_STYLE, state, style, transition, trigger} from "@angular/animations";
import {Zona} from "../../../shared/models/zonas";
import {ZonaCorporalService} from "../../../shared/services/zona-corporal.service";
import {AutocompleteOption, AutocompleteSelectionEvent} from "../../../shared/components/autocomplete-select/autocomplete-select.interface";
import {Usuario} from "../../../shared/models";
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';
import { AuditoriaService } from 'src/app/shared/services/auditoria.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

const DEFAULT_DURATION = 300;

@Component({
  templateUrl: 'cita-reporte.component.html' ,
  styleUrls: ['./cita-reporte.component.scss'],
  providers: [DatePipe],
  animations: [
    trigger('collapse', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-in')),
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-out'))
    ])
  ]
})
export class CitaReporteComponent implements OnInit, OnDestroy, AfterViewInit{

    today: Date;
    formGroup: FormGroup;

    sbcCollectionSede!: Subscription;
    loadingSede = false;
    collectionSede: RSede[] = [];

    collectionData: CitaReporte[] = [];
    submitted = false;

    // Spinner
    rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';
    @ViewChild('tabla') tabla : TblCitaReporteComponent;

    hasValues = false;

    estados: any[] = [];
    servicios: Servicio[] = [];
    tiposCita: any[] = [];

    loading = false;
    CitaEstado= CitaEstado;

    collapsed = true;

    dataZonas: Array<AutocompleteOption>;
    zonas: Zona[] = [];
    sbcZonas: Subscription;

    tipoPerfil = TipoPerfil;
    usuario: Usuario;

    clienteNuevo: any = null;
    unirCitas:boolean = false;

    // Permisos
    accTot: boolean = false;
    accExp: boolean = false;
    accExc: boolean = false;
    accExi: boolean = false;
    accExf: boolean = false;
    accImp: boolean = false;
    accAge: boolean = false;
    accAgeF: boolean = false;
    accAgeR: boolean = false;

    // Validacion Fecha
    maxDate: string = '';
    constructor(
      private reporteservice: ReportesService,
      private formBuilder: FormBuilder,
      private utilsService: UtilsService,
      private datePipe: DatePipe,
      private spinner: NgxSpinnerService,
      private sedeService: SedeService,
      private usuarioService: UsuarioService,
      private estadoService: EstadoService,
      private tipoCitaService: TipoCitaService,
      private servicioService: ServicioService,
      private zonaService: ZonaCorporalService,
      private permisoHelper: PermisoHelper,            
      private auditoriaService : AuditoriaService,
      private router: Router,
    ) {

      this.usuario = this.usuarioService.UsuarioActual;

      this.today = new Date();

      this.formGroup = this.formBuilder.group({
        fechaDesde: new FormControl(this.datePipe.transform(this.today,'yyyy-MM-dd'), Validators.required),
        fechaHasta: new FormControl(this.datePipe.transform(this.today,'yyyy-MM-dd'), Validators.required),
        idSede: new FormControl(0),
        idEstado: new FormControl(0),
        idServicio: new FormControl(0),
        idTipoCita: new FormControl(0),
        idZona: new FormControl(0),
      });

      const observer = new IntersectionObserver(
        ([e]) => e.target.classList.toggle('active', e.intersectionRatio < 1),
        {threshold: [1]}
      );

    }

    ngOnInit(): void {
      this.obtenerSedes();
      this.listarEstadosCita();
      this.listarTiposCita();
      this.listarServicio();
      this.obtenerZonas();
      this.permisoHelper.readPermiso().then((accesos) => {
        this.accTot = accesos.accTot;
        this.accExp = accesos.accExp;
        this.accExc = accesos.accExc;
        this.accExi = accesos.accExi;
        this.accExf = accesos.accExf;
        this.accImp = accesos.accImp;
        this.accAge = accesos.accAge;  
        this.accAgeF = accesos.accAgeF; 
        this.accAgeR = accesos.accAgeR;
        this.setMaxDate();
      });
    }

    ngAfterViewInit(): void {
      this.tabla._collection.subscribe((res: CitaReporte[]) => {
        this.collectionData = res;
        this.hasValues = !!res.length;
      });
      this.tabla._loading.subscribe((res: boolean) => {
        this.loading = res;
      });
    }

    ngOnDestroy(): void {
      if(this.sbcCollectionSede){ this.sbcCollectionSede.unsubscribe(); }
      this.sbcZonas?.unsubscribe();
    }

    setMaxDate(): void {
      if(!this.accAgeF){
        const today = new Date();
        today.setDate(today.getDate() + 1);
        this.maxDate = today.toISOString().split('T')[0];
      }  
    }

    get f(): any{
      return this.formGroup.controls;
    }

    // Obtener data
    obtenerSedes(): void{
      this.loadingSede = true;
      this.sbcCollectionSede = this.sedeService.obtener().subscribe((res: any[]) => {
        const collection: RSede[] = [];
        res.forEach((el) => {
          const sede: RSede = {
            id: el.idSede,
            nombre: el.nombre
          };
          collection.push(sede);
        });

        this.collectionSede = collection;
      }, error => {
        console.log(error);
      }, () => {
        this.loadingSede = false;
      });
    }

    listarEstadosCita(): void{
      this.estadoService.obtenerEstadoByEntidad('Cita').subscribe((res) => {
        this.estados = res;
      }, error => {
        console.log(error);
      })
    }

    listarTiposCita(): void{
      this.tipoCitaService.obtenerTipoCita().subscribe((res) => {
        this.tiposCita = res;
        // console.log(res);
      }, error => {
        console.log(error);
      })
    }

    listarServicio(): void{
      this.servicioService.listarByEstado(1).subscribe((res) => {
        this.servicios = res;
        // console.log(res);
      }, error => {
        console.log(error);
      })
    }

    // On Submit
    obtenerReporte(): void{
      this.submitted = false;
      if( this.formGroup.invalid ){
        this.utilsService.mostrarToast('Seleccionar rango de fechas','error');
        return;
      }
      this.tabla.dataTable.ajax.reload();
    }

    exportar(): void{
      const param = {
        "idusuario": this.usuarioService.UsuarioActual.idUsuario,
        "tipo_opcion": this.router.url,
        "des_operacion": "Descarga",
        "des_nombre_usuario": this.usuarioService.UsuarioActual.nombre,
        "des_nombre_maquina": window.location.hostname, 
        "des_usuario_windows": "",     
        "des_sistema": "",
        "des_usuario_sistema":""
      }
         
      this.auditoriaService.insAuditoria(param).subscribe((res)=>{
        if(res.status === 200){
          this.tabla.dataTable.button(0).trigger();
        }
        else if(res.status === 400){
          Swal.fire('Registro auditoria', "Error en registro de auditoria" , 'info');
        }
      },    
      (error)=>{
        Swal.fire('Registro auditoria', "Error en registro de auditoria" , 'error');
      }); 
  
    }

    // Getters
    get totalCitas(): number{
      return this.collectionData.length;
    }
    totalCitasEstado(idEstado: number): number{
      return this.collectionData.filter(x => x.idEstado === idEstado).length;
    }

    /********************************************************************************************************
     * Events
     */
    toggle() {
      this.collapsed = !this.collapsed;
    }
    expand() {
      this.collapsed = false;
    }
    collapse() {
      this.collapsed = true;
    }


    /********************************************************************************************************
     * Data
     */
    obtenerZonas(): void{
      this.zonaService.obtenerListadoGrilla().subscribe((res: any[]) => {
        this.zonas = res.map(x => {
          const m = new Zona();
          m.id = x.id;
          m.nombre = x.descripcion;
          m.genero = x.genero;
          m.servicio = x.servicio;
          return m;
        });
        this.dataZonas = res.map((x) => {
          return {
            id: x.id.toString(),
            text: `${x.descripcion} (${x.genero})`
          };
        });
        this.dataZonas.unshift({ id: '0', text: 'TODOS' });
      }, error => {
        console.log(error);
      });
    }

    onCheckboxChangeNuevoCliente(event: Event): void {
      const isChecked = (event.target as HTMLInputElement).checked;
      if(isChecked === true) {
        this.clienteNuevo = 1
      } else {
        this.clienteNuevo = null
      }
    }

    onCheckboxChangeUnirCitas(event: Event): void {
      const isChecked = (event.target as HTMLInputElement).checked;
      if(isChecked === true) {
        this.unirCitas = true
      } else {
        this.unirCitas = false
      }
    }

    onZonaSelected(event: AutocompleteSelectionEvent): void {
      // El valor se actualizará automáticamente en el FormControl
      // Este método se puede usar para lógica adicional si es necesario
      console.log('Zona seleccionada:', event.option);
    }
}



