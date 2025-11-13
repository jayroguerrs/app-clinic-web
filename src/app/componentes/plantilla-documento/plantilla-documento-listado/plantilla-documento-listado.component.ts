import {AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import {NgxSpinnerService} from "ngx-spinner";
import {DocumentoPlantilla} from 'src/app/shared/models/documento';
import Api = DataTables.Api;
import {DocumentoPlantillaService} from "../../../shared/services/documento-plantilla.service";
import {Router} from "@angular/router";
import { Subscription } from 'rxjs';
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';

@Component({
  selector: 'app-plantilla-documento-listado',
  templateUrl: './plantilla-documento-listado.component.html',
  styleUrls: ['./plantilla-documento-listado.component.scss']
})

export class PlantillaDocumentoListadoComponent implements OnInit, AfterViewInit, OnDestroy {

  actionForm = 0
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  // Subscriptions
  subscriptionCollection: Subscription;

  // Datatable
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  dtResponsiveOptions: any = {};
  selected = 0;
  datatable: Api;
  documentoSelected: DocumentoPlantilla = null;

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
    private utilsService: UtilsService,
    private documentoPlantillaService: DocumentoPlantillaService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private bottomSheet: MatBottomSheet,
    private permisoHelper: PermisoHelper
    ) {

  }

  ngOnInit(): void {
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

  ngAfterViewInit(): void {
    const _this = this;
    this.datatableElement.dtInstance.then((dtInstance) => {

      _this.datatable = dtInstance;

      dtInstance.on('select', function (e, dt, type, indexes )  {
        _this.selected = dtInstance.rows('.selected').count();
        if ( type === 'row' ) {
          _this.documentoSelected = dtInstance.rows('.selected').data()[0];
          _this.verOpciones();
        }
      });
      dtInstance.on('deselect', function (e, dt, type, indexes ) {
        _this.selected = dtInstance.rows('.selected').count();
        _this.documentoSelected = null;
      });
    });
  }

  ngOnDestroy(): void {
    if(this.subscriptionCollection){ this.subscriptionCollection.unsubscribe(); }
    // Destroy bottom sheet
    if( this.bottomSheet ){ this.bottomSheet.ngOnDestroy(); }
    // Destroy datatable
    this.datatable.destroy(true);
  }

  buildTable(): void{
    this.dtResponsiveOptions = {
      ajax: (dataTablesParameters: any, callback) => {
        const strFiltro = '';
        const mensajeError = 'Error al obtener tipos de documentos';
        this.spinner.show();

        //strFiltro === '' ?
          this.subscriptionCollection = this.documentoPlantillaService.obtenerListado().subscribe(
            (data: DocumentoPlantilla[]) => {
              // console.log(data);
              callback({ data });
              this.spinner.hide();
            },
            error => {
              console.error(mensajeError + error);
              this.spinner.hide();
            }
          )
      },
      select: {
        selector: 'td:not(:first-child)'
      },
      searching: true,
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
        { title: 'Id',  data: 'id',  width: "4%", visible: false, className: 'align-middle' },
        { title: 'Documento', data: 'documento', render: function(val){
            return val.nombre;
          } , className: 'align-middle all ws-normal' },
        { title: 'Version', width: "50px", data: 'version', className: 'align-middle text-center'},
        { title: 'Estado', width: '100px',data: 'estado', className: 'align-middle text-center', render: (val) => { return val ? '<span class="small theme-bg text-white p-1 estado rounded">ACTIVO</span>' :'<span class="small theme-bg2 text-white p-1 estado rounded">INACTIVO</span>' }},
        { title: 'Fecha Registro', width: '100px',data: 'fechaRegistra', className: 'align-middle text-center',render: (val) => { return this.utilsService.formato_FechaString(val)  } },
        { title: 'Usuario', width: '100px',data: 'usuarioRegistra', className: 'align-middle'},
      ],
      serverSide: false,
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
      }
    };
  }

  onView(): void{
    if(!this.selected){
      this.utilsService.mostrarToast('Seleccione una plantilla','warning');
      return;
    }
    const id = this.documentoSelected.id;
    this.router.navigate([`DocumentoPlantilla/${id}/0`]);
  }

  onCreate(): void{
    this.router.navigate(['DocumentoPlantilla/0/1']);
  }

  onEdit(): void{
    if(!this.selected){
      this.utilsService.mostrarToast('Seleccione una plantilla','warning');
      return;
    }
    const id = this.documentoSelected.id;
    this.router.navigate([`DocumentoPlantilla/${id}/2`]);
  }


  refreshTable(): void{
    this.selected = 0;
    this.documentoSelected = null;
    this.datatable.ajax.reload();
  }

  // Opciones menu movil
  verOpciones(): void{
    if(!this.utilsService.isLargeScreen()){
      this.bottomSheet.open(this.TemplateBottomSheet);
    }
  }
  cerrarOpciones(): void{
    this.bottomSheet.dismiss();
  }

}
