import { DatePipe } from '@angular/common';
import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import {Subscription} from "rxjs";
import {DataTableDirective} from "angular-datatables";
import Api = DataTables.Api;
import {MatBottomSheet} from "@angular/material/bottom-sheet";


import Swal from 'sweetalert2';
import {Router} from "@angular/router";
import {animate, AUTO_STYLE, state, style, transition, trigger} from "@angular/animations";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {SedeService} from "../../../shared/services/sede.service";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {CitaAsignadaService} from "../../../shared/services/cita-asignada.service";
import {UsuarioService} from "../../../shared/services/usuario.service";
import {ClienteService} from "../../../shared/services/cliente.service";
import { ClienteNuevoReporte } from 'src/app/shared/models/cliente';
import { ErrorSistema } from 'src/app/shared/models/error-sistema';
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';

const DEFAULT_DURATION = 300;

@Component({
  selector: 'app-reporte-clientes-nuevos',
  templateUrl: './reporte-clientes-nuevos.component.html',
  styleUrls: ['./reporte-clientes-nuevos.component.scss'],
  providers: [DatePipe],
  animations: [
    trigger('slideFromBottom', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(15px)' }),
        animate('300ms {{delay}}ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 }, ))
      ], { params: { delay: 10 } })
    ]),
    trigger('collapse', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-in')),
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-out'))
    ])
  ]
})
export class ReporteClientesNuevosComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  loading: boolean;
  clientesNuevos: ClienteNuevoReporte[] = [];
  subscriptions: Subscription[] = [];
  today = new Date();

  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';


  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: true,
    timerProgressBar: true,
    confirmButtonText: 'IR',
    onOpen: (toast: any) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  fechaDesde: string;
  fechaHasta: string;

  dtResponsiveOptions: any = {};
  formGroup: FormGroup;
  dataTable: Api;

  // Permisos
  accTot: boolean = false;
  accExp: boolean = false;
  accExc: boolean = false;
  accExi: boolean = false;
  accExf: boolean = false;
  accImp: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private sedeService: SedeService,
    private utilsService: UtilsService,
    private citaAsignadaService: CitaAsignadaService,
    private usuarioService: UsuarioService,
    private spinner: NgxSpinnerService,
    private bottomSheet: MatBottomSheet,
    private router: Router,
    private modal: NgbModal,
    private api: ClienteService,
    private permisoHelper: PermisoHelper
  ) {
    this.spinner.hide();
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.loading = false;
    this.buildtable();
    this.permisoHelper.readPermiso().then((accesos) => {
      this.accTot = accesos.accTot;
      this.accExp = accesos.accExp;
      this.accExc = accesos.accExc;
      this.accExi = accesos.accExi;
      this.accExf = accesos.accExf;
      this.accImp = accesos.accImp;  
    });
  }

  ngAfterViewInit(): void {
    // const _this = this;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      this.dataTable = dtInstance;
    //   dtInstance.on('select', function (e, dt, type, indexes ) {
    //     if ( type === 'row' ) {
    //       const data = dtInstance.rows('.selected').data()[0];
    //       _this.selected = dtInstance.rows({selected: true}).count();
    //       _this.dataSelected = data;
    //       _this.idCita = parseInt(data.idCitaString, 10);
    //       _this.verOpciones();
    //     }
    //   });
    //
    //   dtInstance.on('deselect', function (e, dt, type, indexes ) {
    //     _this.dataSelected = null;
    //     _this.selected = dtInstance.rows({ selected: true }).count();
    //   });
    //
    });

    setTimeout(() => {      
      if(this.accTot || this.accExc){
        $('#btnExcel').show();       
      }
      else{
        $('#btnExcel').hide();         
      }
      
    }, 200);
  }

  ngOnDestroy(): void {
    // Destroy modals
    this.subscriptions.forEach(s => s.unsubscribe());
    this.Toast.close();
  }

  /***********************************************************************************************
   * Getter
   */
  get f(): any{
    return this.formGroup.controls;
  }

  buildtable(): void{

    this.dtResponsiveOptions = {
      ajax: (_dataTablesParameters: any, callback) => {


        if(this.formGroup.invalid){
          this.utilsService.mostrarToast('Debe seleccionar una fecha', 'warning');
          callback({ data: [] });
          return;
        }

        this.spinner.show();
        const subs = this.api.reporteClientesNuevos(this.f.fechaDesde.value, this.f.fechaHasta.value).subscribe(
          (data: ClienteNuevoReporte[] | ErrorSistema) => {
            if(data instanceof ErrorSistema){
              this.utilsService.mostrarToast(data.message, 'error');
              callback({ data: [] });
            }else{
              callback({ data });
            }
            this.spinner.hide();
        },
          error => {
            console.log('Error al obtener los clientes nuevos' + error);
            this.spinner.hide();
          }
        );
        this.subscriptions.push(subs);
      },
      select: {
        selector: 'td:not(:first-child)'
      },
      searching: true,
      'columnDefs': [{
        'targets': 0
      }],
      columns: [
        {
          "className":      'dtr-control',
          "orderable":      false,
          "data":           null,
          "defaultContent": '',
          width: '0px'
        },
        { title: 'GENERO',        data: 'genero'},
        { title: 'NOMBRES',        data: 'nombres'},
        { title: 'APELLIDOS',        data: 'apellidos'},
        { title: 'T. DOCUMENTO',        data: 'documento'},
        { title: 'N°. DOCUMENTO',        data: 'numeroDocumento'},
        { title: 'TELF.',        data: 'celular'},
        { title: 'CORREO',        data: 'correo'},
        { title: 'M. CONTACTO',        data: 'medioContacto'},
        { title: 'T. CLIENTE',     data: 'tipoCliente'},
        { title: 'DISTRITO',     data: 'distrito'},
        { title: 'F. REGISTRO',     data: 'fechaRegistro', render: (data) => {
          return this.datePipe.transform(data, 'd/MM/yyyy')
        }},
      ],
      serverSide: false,
      processing: false,
      async: true,
      buttons: [ {
        extend: 'excelHtml5',
        title:  () => {
          return `Reporte de Clientes Nuevos del ${this.fechaDesde} al ${this.fechaHasta}`
        },
        text: 'Exportar Excel',
        className: 'btn btn-sm btn-secondary',
        init: function (api, node, config) {
          $(node).attr('id', 'btnExcel'); // Asigna el id al botón
        }
        // exportOptions: {
        //   columns: [2,4,6,7,8,9,10,11,12,13,15,16,17],
        // }
      }],
      language: this.utilsService.datatableIdioma,
      autoWidth: false,
      responsive: {
        details: {
          renderer: function ( api, rowIdx, columns: any[] ) {
            const data = columns.map( x => {
              return x.hidden ?
                '<tr data-dt-row="'+x.rowIndex+'" data-dt-column="'+x.columnIndex+'">'+
                '<td><b>'+x.title+'</b></td>'+
                '<td><b>:</b></td>'+
                '<td>'+x.data+'</td>'+
                '</tr>' :
                '';
            }).join('');
            const table = document.createElement('table');
            table.classList.add('w-100','table-child');
            table.innerHTML = data;
            return data ? table : false;
          }
        }
      },
      // bLengthChange: false,
      "dom": "<'row'<'col-sm-12'B><'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>"
    };
  }
  inicializarFormulario(): void {
    this.formGroup = this.formBuilder.group({
      fechaDesde: [null, Validators.required],
      fechaHasta: [null, Validators.required]
    });

    this.formGroup.get('fechaDesde').valueChanges.subscribe((v) => {
      if(v){
        this.fechaDesde = v;
      }
    });
    this.formGroup.get('fechaHasta').valueChanges.subscribe((v) => {
      if(v){
        this.fechaHasta = v;
      }
    });

    this.formGroup.patchValue({
      fechaDesde:  this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      fechaHasta:  this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    });
  }
  evtOnReload(): void {
    this.dataTable.ajax.reload();
  }

  cerrarOpciones(): void{
    this.bottomSheet.dismiss();
  }

}
