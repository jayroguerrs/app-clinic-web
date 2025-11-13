import {AfterViewInit, Component, OnInit, ViewChild, OnDestroy, TemplateRef} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PerfilService } from '../../../shared/services/perfil.service';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalConstants } from 'src/commons/global-constants';
import {DataTableDirective} from "angular-datatables";
import { Subscription } from 'rxjs';
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';

@Component({
  selector: 'app-perfil-listado',
  templateUrl: './perfil-listado.component.html',
  styleUrls: ['./perfil-listado.component.scss']
})
export class PerfilListadoComponent implements OnInit, OnDestroy, AfterViewInit {

  frmFiltroGrilla: FormGroup;
  idPerfil: number = 0;
  rutaImageSpinner = GlobalConstants.gIconoSpinner;

  // modals
  modalPerfilConfiguracionRef: NgbModalRef;

  // subscriptions
  sbcCollection: Subscription;

  // datatable
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  dtResponsiveOptions: any = {};
  selected = 0;
  dataTable: any;

  @ViewChild('menuMovil') TemplateBottomSheet: TemplateRef<any>;

  // Permisos
  accTot: boolean = false;
  accExp: boolean = false;
  accExc: boolean = false;
  accExi: boolean = false;
  accExf: boolean = false;
  accImp: boolean = false;
  accCrud: boolean = false;
  accCreate: boolean = false;
  accRead: boolean = false;
  accUpdate: boolean = false;
  accDelete: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private perfilService: PerfilService,
    private utilsService: UtilsService,
    private spinner: NgxSpinnerService,
    private bottomSheet: MatBottomSheet,
    private permisoHelper: PermisoHelper
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.buildTable();
    this.permisoHelper.readPermiso().then((accesos) => {
      this.accTot = accesos.accTot;
      this.accExp = accesos.accExp;
      this.accExc = accesos.accExc;
      this.accExi = accesos.accExi;
      this.accExf = accesos.accExf;
      this.accImp = accesos.accImp;
      this.accCrud = accesos.accCrud;
      this.accCreate = accesos.accCreate;
      this.accRead = accesos.accRead;
      this.accUpdate = accesos.accUpdate;
      this.accDelete = accesos.accDelete;  
    });

  }

  ngOnDestroy(): void {
    // Destroy modals
    if ( this.modalPerfilConfiguracionRef ){ this.modalPerfilConfiguracionRef.close(); }
    // Destroy subscription
    if ( this.sbcCollection ){ this.sbcCollection.unsubscribe(); }
  }

  ngAfterViewInit(): void {
    const _this = this;
    this.datatableElement.dtInstance.then((dtInstance: any) => {

      _this.dataTable = dtInstance;

      dtInstance.on('select', function (e, dt, type, indexes ) {
        _this.selected = dtInstance.rows( { selected: true } ).count() ;
        if ( type === 'row' ) {
          const data = dtInstance.rows('.selected').data()[0];
          _this.idPerfil = data.idPerfil;
          _this.verOpciones();
        }
      });

      dtInstance.on('deselect', function (e, dt, type, indexes ) {
        _this.idPerfil = 0;
        _this.selected = dtInstance.rows( { selected: true } ).count() ;
      });

    });
  }

  inicializarFormulario(): void {
    this.frmFiltroGrilla = this.formBuilder.group({});
  }
  buildTable(): void {
    this.dtResponsiveOptions = {
      ajax: (dataTablesParameters: any, callback) => {
        const mensajeError = 'Error al obtener clientes';

        this.spinner.show();
        this.sbcCollection = this.perfilService.obtener().subscribe(
          data => {
            callback({ data });
          },
          error => {
            console.log(mensajeError + '' + error);
          },
          () => {
            this.spinner.hide();
          }
        );
      },
      columns: [
      { title: 'Id',     data: 'idPerfil',  width: '4%',    visible: false   },
      { title: 'PERFIL', data: 'nombre',    width: '80%'     },
      ],
      serverSide: false,
      pageLength: 20,
      processing: false,
      async: true,
      buttons: [ 'excel' ],
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
      select: true
    };
  }
  perfilListar(): void {
    this.dataTable.ajax.reload();
  }
  perfilNuevo(modal: NgbModalRef): void {
    this.idPerfil = 0;
    this.modalPerfilConfiguracionRef = this.utilsService.abrirModal(modal, 'xl');
    this.modalPerfilConfiguracionRef.result.then(result => this.perfilListar());
  }
  perfilEditar(modal: NgbModalRef): void {
    this.modalPerfilConfiguracionRef = this.utilsService.abrirModal(modal, 'xl');
    this.modalPerfilConfiguracionRef.result.then(result => this.perfilListar());
  }

  // Bottom sheet
  verOpciones(): void{
    if(!this.utilsService.isLargeScreen()){
      this.bottomSheet.open(this.TemplateBottomSheet);
    }
  }
  cerrarOpciones(): void{
    this.bottomSheet.dismiss();
  }

}
