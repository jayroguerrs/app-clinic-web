import {AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IUpdateIds, PromocionService } from '../../../shared/services/promocion.services';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {AuthService} from "../../../shared/services/auth.service";
import { ErrorSistema } from 'src/app/shared/models/error-sistema';
declare var $: any;

import Swal from 'sweetalert2';
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { AuditoriaService } from 'src/app/shared/services/auditoria.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'promocion-listado.component.html',
  styleUrls: ['./promocion-listado.component.scss']
})
export class PromocionListadoComponent implements OnInit, OnDestroy, AfterViewInit {
  frmFiltroGrilla: FormGroup;
  idPromocion: number;
  promocion: string;
  idServicio: number = 0;

  promocionSelected: any | null = null;

  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  // subscriptions
  sbcCollection: Subscription;

  // modales
  modalPromocionDatosRef: NgbModalRef
  modalPromocionPlantillaRef: NgbModalRef
  modalPromocionPrecioRef: NgbModalRef

  // datatable
  @ViewChild(DataTableDirective, { static: false }) datatableElement: DataTableDirective;
  dtResponsiveOptions: any = {};
  dataTable: any;
  selected = 0;

  @ViewChild('menuMovil') TemplateBottomSheet: TemplateRef<any>;

  subscriptions: Subscription[] = [];
  ldClone: boolean;

  // Permisos
  accTot: boolean = false;
  accExp: boolean = false;
  accExc: boolean = false;
  accImp: boolean = false;
  accCrud: boolean = false;
  accCreate: boolean = false;
  accRead: boolean = false;
  accUpdate: boolean = false;
  accDelete: boolean = false;

  promotion: any

  constructor(
    private promocionService: PromocionService,
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private bottomSheet: MatBottomSheet,
    private auth: AuthService,
    private permisoHelper: PermisoHelper,    
    private usuarioService: UsuarioService,
    private auditoriaService : AuditoriaService,
    private router: Router,
  ) {
    this.ldClone = false;
  }

  ngOnInit() {
    this.inicializarFormulario();
    this.buildtable();
    this.permisoHelper.readPermiso().then((accesos) => {
      this.accTot = accesos.accTot;
      this.accExp = accesos.accExp;
      this.accExc = accesos.accExc;
      this.accImp = accesos.accImp;
      this.accCrud = accesos.accCrud;
      this.accCreate = accesos.accCreate;
      this.accRead = accesos.accRead;
      this.accUpdate = accesos.accUpdate;
      this.accDelete = accesos.accDelete;
    });

    (window as any).handleCheckboxChange = (idPromocion: number, isChecked: boolean) => {
      this.onCheckboxChange(idPromocion, isChecked);
    };
  }
  ngOnDestroy(): void {
    // Destroy modal
    if( this.modalPromocionDatosRef ){ this.modalPromocionDatosRef.close(); }
    if( this.modalPromocionPlantillaRef ){ this.modalPromocionPlantillaRef.close(); }
    if( this.modalPromocionPrecioRef ){ this.modalPromocionPrecioRef.close(); }
    // Destroy subscription
    if( this.sbcCollection ){ this.sbcCollection.unsubscribe(); }
    // Destroy bottom sheet
    if( this.bottomSheet ){ this.bottomSheet.ngOnDestroy(); }
    // Destroy datatable
    if(this.dataTable){ this.dataTable.destroy(true);}

    delete (window as any).handleCheckboxChange;
  }

  ngAfterViewInit(): void {
    const _this = this;
    this.datatableElement.dtInstance.then((dtInstance: any) => {

      _this.dataTable = dtInstance;

      dtInstance.on('select', function (e, dt, type, indexes )  {
        if ( type === 'row' ) {
          const data = dtInstance.rows('.selected').data()[0];
          _this.promocionSelected = data;
          _this.idPromocion = data.idPromocion;
          _this.promocion = data.descripcion;
          _this.idServicio = data.idServicio;
          _this.verOpciones();
        }
        _this.selected = dtInstance.rows( { selected: true } ).count();
      });

      dtInstance.on('deselect', function (e, dt, type, indexes ) {
        _this.promocionSelected = null;
        _this.idPromocion = 0;
        _this.promocion = '';
        _this.idServicio = 0;
        _this.selected = dtInstance.rows( { selected: true } ).count();
      });

   });
}
  inicializarFormulario(): void{
    this.frmFiltroGrilla = this.formBuilder.group({ filterNombre: [''] });
  }

  buildtable() {
    this.dtResponsiveOptions = {
      ajax: (dataTablesParameters: any, callback) => {
        const strFiltro = this.frmFiltroGrilla.controls.filterNombre.value;
        const mensajeError = 'Error al obtener promociones ';
        this.spinner.show();

        const handleData = (data: any[]) => {
          // Agregar la propiedad originalProStatus a cada promoción
          data.forEach((promocion: any) => {
            promocion['originalProStatus'] = promocion.proStatus; // Inicializar con el valor actual
          });
          this.promotion = data;
          callback({ data });
          this.spinner.hide();
        };

        strFiltro === ''
        ? (this.sbcCollection = this.promocionService.obtener(0).subscribe(
            (data) => handleData(data),
            (error) => {
              console.log(mensajeError + error);
              this.spinner.hide();
            }
          ))
        : (this.sbcCollection = this.promocionService.searchByLikeNombre(strFiltro).subscribe(
            (data) => handleData(data),
            (error) => {
              console.log(mensajeError + error);
              this.spinner.hide();
            }
          ));
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
        {
          title: 'HABILITADO',
          data: 'proStatus',
          width: '0px',
          "orderable":      false,
          className: "text-right table-active fon-bold-grilla",
          render: (data, type, row) => {
            return `
              <input type="checkbox" id="usuario-${row.idPromocion}" 
                     ${row.proStatus ? 'checked' : ''} 
                     onchange="handleCheckboxChange(${row.idPromocion}, this.checked)">
            `;
          }
        },
        { title: 'ID', data: 'idPromocion', width: "4%", visible: false },
        { title: 'PROMOCION', data: 'descripcion', className: "text-right table-active fon-bold-grilla" },
        { title: 'CATEGORIA', data: 'promocionCategoria'},
        { title: 'FECHA INICIO', width: "5%", data: 'fechaInicio' },
        { title: 'FECHA FIN',  width: "5%", data: 'fechaFin' },
        { title: 'SERVICIO', data: 'servicio', width: '100px', render: (data,row,full) => {
            return data ? `<span class="rounded py-1 px-2 text-uppercase text-white small" style="background-color:${full.servicioColor}" >${full.servicio}</span>` : '';
          }},
        { title: 'PROMOCION.BASE', width: "5%", data: 'refDescrip' },
        { title: 'ZONA A USAR', data: 'zonaUsarDes', width: "5%" },
        { title: 'ACTIVO', width: "5%", data: 'activo',
            render: (data: any) => (data == 1) ? '<span class="small theme-bg text-white p-1 estado rounded">ACTIVO</span>' : '<span class="small theme-bg2 text-white p-1 estado rounded">INACTIVO</span>'},
        { title: 'VIGENTE', width: "5%", data: 'vigente',
          render: (data: any) => (data == 1) ? '<span class="small bg-success text-white p-1 estado rounded">SI</span>' : '<span class="small bg-danger text-white p-1 estado rounded">NO</span>'},
        { title: 'USU. REG', width: "5%", data: 'usuarioRegistra', },
        { title: 'FECH. REG', width: "5%", data: 'fechaRegistra', render: (data: any) => new Date(data).toLocaleString().substring(0, 10) },
        { title: 'ACCESO', width: "5%", data: 'perfilDes' },
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
      order: [[ 0, "desc" ]],
    };
  } 
  promocionListar(): void{ this.dataTable.ajax.reload(); }
  nuevoPromocionDatos(modal: any): void{
    this.idPromocion = 0;
    this.promocion = '';
    this.modalPromocionDatosRef = this.utilsService.abrirModal(modal, 'lg');
    this.modalPromocionDatosRef.result.then(result => this.promocionListar());
  }
  editarPromocionDatos(modal: any): void{
    if( !this.selected ){
      this.utilsService.mostrarToast('Seleccionar promoción','warning');
      return;
    }
    this.modalPromocionDatosRef = this.utilsService.abrirModal(modal, 'lg');
    this.modalPromocionDatosRef.result.then(result => this.promocionListar());
  }
  editarPromocionPlantilla(modal:any): void{
    if( !this.selected ){
      this.utilsService.mostrarToast('Seleccionar promoción','warning');
      return;
    }
    this.modalPromocionPlantillaRef = this.utilsService.abrirModal(modal, 'lg');
    this.modalPromocionPlantillaRef.result.then(result => this.promocionListar());
  }
  editarPromocionPrecio(modal:any): void{
    if( !this.selected ){
      this.utilsService.mostrarToast('Seleccionar promoción','warning');
      return;
    }
    this.modalPromocionPrecioRef = this.utilsService.abrirModal(modal, 'xl');
    this.modalPromocionPrecioRef.result.then(result => this.promocionListar());
  }
  exportarTabla(): void{
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
        this.dataTable.button(0).trigger();
      }
      else if(res.status === 400){
        Swal.fire('Rgistro auditoria', "Error en registro de auditoria" , 'info');
      }
    },    
    (error)=>{
      Swal.fire('Rgistro auditoria', "Error en registro de auditoria" , 'error');
    }); 
  }

  // Menu Mobile
  verOpciones(): void{
    if(!this.utilsService.isLargeScreen()){
      this.bottomSheet.open(this.TemplateBottomSheet);
    }
  }
  cerrarOpciones(): void{
    this.bottomSheet.dismiss();
  }


  /**********************************************************************************
   * Events
   */
  evtClone(): void{

    Swal.fire({
      title: 'Duplicar Promoción',
      html: `¿Desea duplicar la promoción <b>${this.promocionSelected.descripcion}</b> ?`,
      icon: 'question',
      buttonsStyling: false,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      customClass: {
        confirmButton: 'btn sbtn btn-primary btn-active-primary popins',
        cancelButton: 'btn sbtn btn-light popins mr-2',
      },
      reverseButtons: true
    }).then( (result) => {
      if (result.value) {
        this.ldClone = true;
        const subs = this.promocionService.clone(this.idPromocion, this.auth.getUser().id).subscribe((res: boolean | ErrorSistema) => {
          if(res instanceof ErrorSistema){
            this.utilsService.mostrarToast(res.message, 'error');
          }else{
            this.promocionListar();
            this.utilsService.mostrarToast('Se duplico la promoción con éxito!!', 'success');
          }
          this.ldClone = false;
        }, error => {
          console.log(error);
          this.utilsService.mostrarToast('Ocurrio un error', 'error');
          this.ldClone = false;
        });
        this.subscriptions.push(subs)
      }
    });

  }


  checkBoxAlterates: Array<IUpdateIds> = [];

  onCheckboxChange(idPromocion: number, isChecked: boolean): void {
    console.log(idPromocion, isChecked, "=================")
    const promocion = this.promotion.find((p: any) => p.idPromocion === idPromocion);
    if (promocion) {
      promocion.proStatus = isChecked; // Actualiza el estado en la tabla
  
      // Verificar si el ID ya está en el arreglo de alterados
      const index = this.checkBoxAlterates.findIndex((item) => item.id === idPromocion);
      if (index !== -1) {
        // Si ya existe, actualiza el estado
        this.checkBoxAlterates[index].status = isChecked ? 1 : 0;
      } else {
        // Si no existe, agrégalo
        this.checkBoxAlterates.push({ id: idPromocion, status: isChecked ? 1 : 0 });
      }
    }
  }
  updatePromotion() {
    // Eliminar duplicados y mantener solo los últimos cambios
    const uniqueUpdates = this.checkBoxAlterates.reduce((acc: any, current) => {
      const existingIndex = acc.findIndex((item: any) => item.id === current.id);
      if (existingIndex !== -1) {
        // Si ya existe, actualiza el estado
        acc[existingIndex] = current;
      } else {
        // Si no existe, agrégalo
        acc.push(current);
      }
      return acc;
    }, []);
  
    // Verificar si hay cambios para enviar
    if (uniqueUpdates.length === 0) {
      this.utilsService.mostrarToast('No hay cambios para actualizar.', 'info');
      return;
    }
  
    // Mostrar un spinner mientras se realiza la actualización
    this.spinner.show();
    //return console.log(uniqueUpdates, "uniqueUpdatesuniqueUpdatesuniqueUpdatesuniqueUpdates")
    // Llamar al servicio para actualizar los estados
    this.promocionService.updateStatus(uniqueUpdates).subscribe(
      (response) => {
        this.utilsService.mostrarToast('Estados actualizados correctamente.', 'success');
        this.promocionListar(); // Recargar la tabla después de la actualización
  
        // Limpiar el arreglo de alterados después de la actualización
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
