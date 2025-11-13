import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DataTableDirective} from "angular-datatables";
import {Subscription} from "rxjs";
import {DatePipe} from "@angular/common";
import {UtilsService} from "../../shared/services/funciones/utils.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ReportePreferenteService} from "../../shared/services/reporte-preferente.service";
import {PreferenteReporteMedioContacto} from "../../shared/models/preferente.model";
import {MedioContacto} from "../../componentes/preferente/preferente.models";
import {MedioContactoService} from "../../shared/services/medio-contacto.service";
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';

@Component({
  selector: 'app-preferentes-redes',
  templateUrl: './preferentes-redes.component.html',
  styleUrls: ['./preferentes-redes.component.scss']
})
export class PreferentesRedesComponent implements OnInit, AfterViewInit, OnDestroy {

  formGroup: FormGroup;

  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  dtResponsiveOptions: any = {};

  collection: PreferenteReporteMedioContacto[] = [];
  subscription: Subscription | undefined;
  dataTable: any;

  mediosContacto: MedioContacto[] = [];
  loadingMediosContacto = false;
  sbcMediosContacto: Subscription;

  // Permisos
  accTot: boolean = false;
  accExp: boolean = false;
  accExc: boolean = false;
  accExi: boolean = false;
  accExf: boolean = false;
  accImp: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private api: ReportePreferenteService,
    private medioContactoService: MedioContactoService,
    private datePipe: DatePipe,
    private utilsService: UtilsService,
    private spinner: NgxSpinnerService,
    private permisoHelper: PermisoHelper
  ) {

    const today = new Date();

    this.formGroup = this.formBuilder.group({
      fechaDesde: new FormControl( this.datePipe.transform(today,'yyyy-MM-dd'), Validators.required ),
      fechaHasta: new FormControl( this.datePipe.transform(today,'yyyy-MM-dd'), Validators.required ),
      idMedioContacto: new FormControl(0, Validators.required),
    });

  }

  // getters
  get f(): any{
    return this.formGroup.controls;
  }

  get totalPreferentes(): number{
    return this.collection.length ?  this.collection.map(x => x.totalPreferentes).reduce((x,y) => x+y, 0) : 0;
  }

  get totalAsignados(): number{
    return this.collection.length ?  this.collection.map(x => x.totalAsignados).reduce((x,y) => x+y, 0) : 0;
  }

  get totalAgendados(): number{
    return this.collection.length ?  this.collection.map(x => x.totalAgendados).reduce((x,y) => x+y, 0) : 0;
  }

  get totalEfectivos(): number{
    return this.collection.length ? this.collection.map(x => x.totalEfectivos).reduce((x,y) => x+y, 0) : 0;
  }

  get totalEfectivosNuevos(): number{
    return this.collection.length ? this.collection.map(x => x.totalEfectivosNuevos).reduce((x,y) => x+y, 0) : 0;
  }

  get totalEfectivosAntiguos(): number{
    return this.collection.length ? this.collection.map(x => x.totalEfectivosAntiguos).reduce((x,y) => x+y, 0) : 0;
  }

  get porcentajeAsignados(): number{
    return isNaN(this.totalAsignados / this.totalPreferentes ) ? 0 : (this.totalAsignados / this.totalPreferentes) * 100;
  }

  get porcentajeAgendados(): number{
    return isNaN(this.totalAgendados / this.totalPreferentes ) ? 0 : (this.totalAgendados / this.totalPreferentes) * 100;
  }

  get porcentajeEfectivos(): number{
    return isNaN(this.totalEfectivos / this.totalPreferentes ) ? 0 : (this.totalEfectivos / this.totalPreferentes) * 100;
  }

  get porcentajeEfectivosNuevos(): number{
    return isNaN(this.totalEfectivosNuevos / this.totalPreferentes ) ? 0 : (this.totalEfectivosNuevos / this.totalPreferentes) * 100;
  }

  get porcentajeEfectivosAntiguos(): number{
    return isNaN(this.totalEfectivosAntiguos / this.totalPreferentes ) ? 0 : (this.totalEfectivosAntiguos / this.totalPreferentes) * 100;
  }

  ngOnInit(): void {
    this.buildTable();
    this.listarMediosContacto();
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
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      this.dataTable = dtInstance;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.sbcMediosContacto?.unsubscribe();
  }

  // Funciones
  buildTable(): void{
    this.dtResponsiveOptions = {
      ajax : (_: any, callback) => {

        this.spinner.show();

        this.subscription = this.api.reporteMedioContacto( this.datePipe.transform(this.f.fechaDesde.value, 'yyyy-MM-dd'), this.datePipe.transform(this.f.fechaHasta.value, 'yyyy-MM-dd'), parseInt(this.f.idMedioContacto.value, 10) ).subscribe((res: PreferenteReporteMedioContacto[]) => {

          callback({ data : res });
          this.collection = res;
          this.spinner.hide();
        }, error => {
          callback({ data : [] });
          this.spinner.hide();
          this.utilsService.mostrarToast('Ocurrio un error','error');
          console.log(error);
        }, () => {
        });

      },
      searching: false,
      'columnDefs': [{
        'max-width': '34px',
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
        { title: 'Fecha', data: 'fecha' , className: 'align-middle', render: (data: Date, type, row) => {
            return this.datePipe.transform(data, 'dd/MM/yyyy');
          }},
        { title: 'Preferentes', data: 'totalPreferentes' , className: 'align-middle'},
        { title: 'Asignados', data: 'totalAsignados' , className: 'align-middle'},
        { title: 'Agendados', data: 'totalAgendados' , className: 'align-middle'},
        { title: 'Efectivos', data: 'totalEfectivos' , className: 'align-middle'},
        { title: 'E. Nuevos', data: 'totalEfectivosNuevos' , className: 'align-middle'},
        { title: 'E. Antiguos', data: 'totalEfectivosAntiguos' , className: 'align-middle'},
        { title: 'Medio Contacto', data: 'medioContacto' , className: 'align-middle'},
      ],
      serverSide: false,
      processing: false,
      async: true,
      buttons: [
        {
          extend: 'excelHtml5',
          title: () => {
            return 'Reporte Preferente Medio Contacto - '+ this.datePipe.transform(this.f.fechaDesde, 'yyyy-MM-dd') + ' hasta ' + this.datePipe.transform(this.f.fechaHasta, 'yyyy-MM-dd');
          }
        }
      ],
      language: this.utilsService.datatableIdioma,
      autoWidth: false,
      responsive: {
        details: {
          renderer: function ( api, rowIdx, columns: any[] ) {
            const data = columns.map( x => {
              return x.hidden ?
                '<tr data-dt-row="' + x.rowIndex + '" data-dt-column="'+x.columnIndex+'">' +
                '<td><b>' + x.title + '</b></td>' +
                '<td><b>:</b></td>' +
                '<td>' + x.data + '</td>' +
                '</tr>' :
                '';
            }).join('');
            const table = document.createElement('table');
            table.classList.add('w-100','table-child');
            table.innerHTML = data;
            return data ? table : false;
          }
        }
      }
    };
  }

  search(): void{
    this.dataTable.ajax.reload();
  }

  export(): void{
    this.dataTable.button(0).trigger();
  }
  // Data
  listarMediosContacto(): void{
    this.loadingMediosContacto = true;
    this.sbcMediosContacto = this.medioContactoService.obtenerMedioContacto().subscribe((res: MedioContacto[]) => {
      this.mediosContacto = res;
    }, error => {
      console.log(error);
    });
  }

}
