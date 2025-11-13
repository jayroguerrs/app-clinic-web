import {AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {DocumentoTipoService} from "../../../shared/services/documento-tipo.service";
import {NgxSpinnerService} from "ngx-spinner";
import {DocumentoTipo, DocumentoTipoPerfil} from 'src/app/shared/models/documento';
import Api = DataTables.Api;
import { Subscription } from 'rxjs';
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {TipoDocumentoDatosComponent} from "../tipo-documento-datos/tipo-documento-datos.component";
import {DatePipe} from "@angular/common";
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';
import { IUpdateIds } from '../../../shared/interfaces/updateStatus';


@Component({
  selector: 'app-tipo-documento-listado',
  templateUrl: './tipo-documento-listado.component.html',
  styleUrls: ['./tipo-documento-listado.component.scss']
})

export class TipoDocumentoListadoComponent implements OnInit, AfterViewInit, OnDestroy {



  idTipoDocumento = 0;

  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  // Datatable
  @ViewChild(DataTableDirective, {static: false}) dataTableElement: DataTableDirective;
  dtResponsiveOptions: any = {};
  selected = 0;
  dataTable: Api;
  documentoSelected: DocumentoTipo = null;

  // Modal
  modalTipoDocumentoDatosRef: NgbModalRef;
  modalPerfilesRef: NgbModalRef;

  // Subscription
  sbcCollection: Subscription;

  @ViewChild('menuMovil') TemplateBottomSheet: TemplateRef<any>;

  
  document: any
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
    private documentoTipoService: DocumentoTipoService,
    private spinner: NgxSpinnerService,
    private bottomSheet: MatBottomSheet,
    private modal: NgbModal,
    private datePipe: DatePipe,
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

    (window as any).handleCheckboxChange = (idDocument: number, isChecked: boolean) => {
      this.onCheckboxChange(idDocument, isChecked);
    };
  }

  ngOnDestroy(): void {
    // Destroy Modals
    if( this.modalTipoDocumentoDatosRef ){ this.modalTipoDocumentoDatosRef.close(); }
    if( this.modalPerfilesRef ){ this.modalPerfilesRef.close(); }
    // Destroy Subscription
    if( this.sbcCollection ){ this.sbcCollection.unsubscribe(); }
    // Destroy bottom sheet
    if( this.bottomSheet ){ this.bottomSheet.ngOnDestroy(); }
    // Destroy dataTable
    if(this.dataTable){ this.dataTable.destroy(true);}

    delete (window as any).handleCheckboxChange;
  }

  ngAfterViewInit(): void {
    const _this = this;
    this.dataTableElement.dtInstance.then((dtInstance) => {

      _this.dataTable = dtInstance;

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

  buildTable(): void{
    this.dtResponsiveOptions = {
      ajax: (dataTablesParameters: any, callback) => {
        const strFiltro = '';
        const mensajeError = 'Error al obtener tipos de documentos';
        this.spinner.show();

        const handleData = (data: any[]) => {
          // Agregar la propiedad originalProStatus a cada promoción
          data.forEach((document: any) => {
            document['originalDocStatus'] = document.docStatus; // Inicializar con el valor actual
          });
          this.document = data;
          callback({ data });
          this.spinner.hide();
        };

        //strFiltro === '' ?
          this.sbcCollection = this.documentoTipoService.obtenerListado().subscribe(
            (data: DocumentoTipo[]) => {
              //callback({ data });
              handleData(data);
              this.spinner.hide();
            },
            error => {
              console.error(mensajeError + error);
              this.spinner.hide();
            }
          )
          /*:
          this.tipoCitaService.searchByLikeNombre(strFiltro).subscribe(
            data => {
              callback({  data });
              this.spinner.hide();
            },
            error => {
              console.log(mensajeError + error);
              this.spinner.hide();
            }
          );*/
        // $('#btnEditar1, #btnEditar2').hide();
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
        {
          title: 'HABILITADO',
          data: 'docStatus',
                    width: '0px',
          "orderable":      false,
          className: "text-right table-active fon-bold-grilla",
          render: (data, type, row) => {
            return `
              <input type="checkbox" id="usuario-${row.id}" 
                     ${row.docStatus ? 'checked' : ''} 
                     onchange="handleCheckboxChange(${row.id}, this.checked)">
            `;
          }
        },
        { title: 'IdTipoDocumento',  data: 'id',  width: "4%", visible: false, className: 'align-middle' },
        { title: 'NOMBRE', data: 'nombre', className: 'align-middle all ws-normal', visible: true },
        { title: 'TITULO', data: 'titulo', className: 'align-middle'},
        { title: 'PERFILES', data: 'perfiles', render: function ( data: DocumentoTipoPerfil[] ) {
            let output = '';
            data.forEach( (perfil: DocumentoTipoPerfil) => {
              output += `<div class="rounded bg-primary text-white px-2 py-1 d-inline-block mr-2 small">${perfil.nombre}</div>`;
            });
            return output;
        }, className: 'align-middle all ws-normal'},
        { title: 'SERVICIO', data: 'servicio', width: '100px', render: (data,row,full) => {
            return data ? `<span class="rounded py-1 px-2 text-uppercase text-white small" style="background-color:${full.servicioColor}" >${full.servicio}</span>` : '';
        }},
        { title: 'U. REG.',data: 'usuarioRegistro', className : 'align-middle'},
        { title: 'F. REG', data: 'fechaRegistro', className : 'align-middle ', render: (data: Date | null) => {
            return data ? this.datePipe.transform(data, 'dd-MM-yyyy') : '';
          }},
        { title: 'U. MDF.',data: 'usuarioModifico', className : 'align-middle'},
        { title: 'F. MDF', data: 'fechaModifico', className : 'align-middle ', render: (data: Date | null) => {
            return data ? this.datePipe.transform(data, 'dd-MM-yyyy') : '';
          }},
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
      },
    };
  }

  onCreate(): void {
    const modal = this.modal.open(TipoDocumentoDatosComponent, {size: 'md'});
    modal.componentInstance.id = 0;
    modal.result.then(result =>{
      if(result){
        this.refreshTable(true);
      }
    });
  }

  onUpdate(): void{
    if(!this.selected){
      this.utilsService.mostrarToast('Seleccionar un tipo de documento','warning');
      return;
    }
    const modal = this.modal.open(TipoDocumentoDatosComponent, {size: 'md'});
    modal.componentInstance.id = this.documentoSelected?.id;
    modal.result.then(result =>{
      if(result){
        this.refreshTable();
      }
    });
  }

  onAssignProfile( modal: any ): void{
    if(!this.selected){
      this.utilsService.mostrarToast('Seleccionar un tipo de documento','warning');
      return;
    }
    this.modalPerfilesRef = this.utilsService.abrirModal(modal, 'md');
    this.modalPerfilesRef.result.then(result => this.refreshTable());
  }

  refreshTable( resetPaging = false ): void{
    this.selected = 0;
    this.documentoSelected = null;
    this.dataTable.ajax.reload( null, resetPaging );
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


  
    checkBoxAlterates: Array<IUpdateIds> = [];
  
    onCheckboxChange(idDocument: number, isChecked: boolean): void {
      const document = this.document.find((p: any) => p.id === idDocument);
      if (document) {
        document.docStatus = isChecked; 
        
        const index = this.checkBoxAlterates.findIndex((item) => item.id === idDocument);
        if (index !== -1) {
          this.checkBoxAlterates[index].status = isChecked ? 1 : 0;
        } else {
          this.checkBoxAlterates.push({ id: idDocument, status: isChecked ? 1 : 0 });
        }
      }
    }
    updateDocument() {
      const uniqueUpdates = this.checkBoxAlterates.reduce((acc: any, current) => {
        const existingIndex = acc.findIndex((item: any) => item.id === current.id);
        if (existingIndex !== -1) {
          acc[existingIndex] = current;
        } else {
          acc.push(current);
        }
        return acc;
      }, []);
    
      if (uniqueUpdates.length === 0) {
        this.utilsService.mostrarToast('No hay cambios para actualizar.', 'info');
        return;
      }

      this.spinner.show();
      this.documentoTipoService.updateStatus(uniqueUpdates).subscribe(
        (response) => {
          this.utilsService.mostrarToast('Estados actualizados correctamente.', 'success');
          this.refreshTable(true); 
    
          this.checkBoxAlterates = [];
          this.spinner.hide();
        },
        (error) => {
          console.error('Error al actualizar los estados:', error);
          this.utilsService.mostrarToast('Error al actualizar los estados.', 'error');
          this.spinner.hide();
        }
      );
    }
}
