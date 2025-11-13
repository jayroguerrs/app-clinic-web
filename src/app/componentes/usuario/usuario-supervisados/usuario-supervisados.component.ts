import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { PerfilService } from '../../../shared/services/perfil.service';
import { SedeService } from '../../../shared/services/sede.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';
import { AuditoriaService } from 'src/app/shared/services/auditoria.service';
import { MdlVerClaveComponent } from '../../modals/mdl-ver-clave/mdl-ver-clave.component';
import { MdlCambiarClaveComponent } from '../../modals/mdl-cambiar-clave/mdl-cambiar-clave.component';
import { Subscription } from 'rxjs';
import { AprobarUsuario, Usuario } from '../../../shared/models/usuario';
import Swal from 'sweetalert2';
import { TipoPerfil } from '../../../shared/enumeracion/enums';

@Component({
  selector: 'app-usuario-supervisados',
  templateUrl: './usuario-supervisados.component.html',
  styleUrls: ['./usuario-supervisados.component.scss']
})
export class UsuarioSupervisadosComponent implements OnInit, AfterViewInit {

  idUsuario: number;
  id: number;
  maestroPerfiles = [];
  maestroSedes= [];
  usuario = new Usuario(0, '', '', '', 0, 1, '', 0, '');
  listaUsuarioPerfil: any;
  listaDocumentacion: any;
  frmFiltroGrilla: FormGroup;
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  // Datatable
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  dtResponsiveOptions: any = {};
  selected = 0;
  dataTable: any;
  usuarioSelected: Usuario | undefined | null;

  // Modals
  modalUsuarioDatosRef: NgbModalRef;

  // Subscriptions
  sbcCollection: Subscription;
  sbcCollectionPerfiles: Subscription;
  sbcCollectionSede: Subscription;

  @ViewChild('menuMovil') TemplateBottomSheet: TemplateRef<any>;

  tipoPerfil = TipoPerfil

  // Permisos
  accTot: boolean = false;
  accExp: boolean = false;
  accExc: boolean = false;
  accExi: boolean = false;
  accImp: boolean = false;
  accCrud: boolean = false;
  accCreate: boolean = false;
  accRead: boolean = false;
  accUpdate: boolean = false;
  accDelete: boolean = false;

  constructor(
    public usuarioService: UsuarioService,
    private perfilService: PerfilService,
    private sedeService: SedeService,
    private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private spinner: NgxSpinnerService,
    private bottomSheet: MatBottomSheet,
    private modalService: NgbModal,
    private permisoHelper: PermisoHelper,        
    private auditoriaService : AuditoriaService,
    private router: Router,
    ) { }

  ngOnInit() {
    this.inicializarFormulario();
    this.obtenerPerfil();
    this.obtenerSede();
    this.buildtable();
    this.permisoHelper.readPermiso().then((accesos) => {
      this.accTot = accesos.accTot;
      this.accExp = accesos.accExp;
      this.accExc = accesos.accExc;
      this.accExi = accesos.accExi;
      this.accImp = accesos.accImp;  
      this.accCrud = accesos.accCrud;
      this.accCreate = accesos.accCreate;
      this.accRead = accesos.accRead;
      this.accUpdate = accesos.accUpdate;
      this.accDelete = accesos.accDelete;
    });

    (window as any).toggleEstadoUsuario = (idUsuario: number, isActive: boolean) => {
      this.cambiarEstadoUsuario(idUsuario, isActive);
    };
  }

  ngOnDestroy(): void {
    // Destroy  modals
    if( this.modalUsuarioDatosRef ){ this.modalUsuarioDatosRef.close(); }
    // Destroy subscriptions
    if( this.sbcCollection ){ this.sbcCollection.unsubscribe(); }
    if( this.sbcCollectionPerfiles ){ this.sbcCollectionPerfiles.unsubscribe(); }
    if( this.sbcCollectionSede ){ this.sbcCollectionSede.unsubscribe(); }
  }

  ngAfterViewInit(): void{
    const _this = this;
    this.datatableElement.dtInstance.then((dtInstance: any) => {

      _this.dataTable = dtInstance;

      dtInstance.on('select', function (e, dt, type, indexes )  {
        if ( type === 'row' ) {
          const data = dtInstance.rows('.selected').data()[0];

          _this.id = data.idUsuario;
          _this.idUsuario = data.idUsuario;
          _this.listaDocumentacion = data;
          _this.usuarioSelected = data;

          _this.verOpciones();
        }
        _this.selected = dtInstance.rows({ selected: true }).count();
      });
      dtInstance.on('deselect', function (e, dt, type, indexes ) {
        _this.idUsuario = 0;
        _this.selected = dtInstance.rows({ selected: true }).count();
        _this.usuarioSelected = null;
      });
    });
  }

  verPorsupervisados(): void{
    this.usuarioService.obtenerListadoGrillaBySupervisor(this.usuarioService.UsuarioActual.idUsuario).subscribe(
      resultado => {
      },
      error => {
        console.log('error en obtener usuarios ' + error );
      }
    );
  }

  inicializarFormulario(): void{
    this.frmFiltroGrilla = this.formBuilder.group({ filterNombre: [''] });
  }
  buildtable(): void{
    this.dtResponsiveOptions = {
      ajax: (_dataTablesParameters: any, callback) => {
          const strFiltro = this.frmFiltroGrilla.controls.filterNombre.value;
          const mensajeError = 'Error al obtener usuarios ';

          this.spinner.show();
          strFiltro === '' ?
          this.sbcCollection = this.usuarioService.obtenerListadoGrillaBySupervisor(this.usuarioService.UsuarioActual.idUsuario).subscribe(
            data => {
              callback({ data });
            },
            error => {
              console.log(mensajeError + error);
            }, () => { this.spinner.hide(); }
          )
          :
          this.sbcCollection = this.usuarioService.obtenerByLikeNombre(strFiltro).subscribe(
            data => {
              callback({ data });
            },
            error => {
              console.log(mensajeError + error);
            }, () => { this.spinner.hide(); }
          );
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
        { title: 'ID', data: 'idUsuario', width: "4%", visible: false, bSortable: false, className: 'align-middle' },
        { title: 'NOMBRE', data: 'nombre', width: "20%" , bSortable: true, className: 'align-middle'},
        { title: 'USUARIO', data: 'usuario', width: "10%" , bSortable: true, className: 'align-middle'},
        // { title: 'PERFIL', data: 'perfil', width: "5%", bSortable: true, className: 'align-middle' },
        { title: 'SEDE', data: 'sede', width: "5%" , bSortable: true, className: 'align-middle'},
        { title: 'ESTADO', width: "5%", data: 'idEstado', bSortable: true, className: 'align-middle',
          render: (data: number) => { return (data == 1) ? '<span class="small theme-bg text-white p-1 estado rounded">APROBADO</span>' : (data == 3) ? '<span class="small theme-bg2 text-white p-1 estado rounded">PENDIENTE</span>' : '<span class="small theme-bg3 text-white p-1 estado rounded">DENEGADO</span>'; } },
        { 
          title: '', 
          width: '5%', 
          data: 'idEstado', 
          defaultContent: '',
          className: 'text-center align-middle',
          render: (data, type, row) => {
            // Si es solo para renderizado y no para filtrado/ordenamiento
            if (type !== 'display') return data;
            
            // El estado actual (1 = activo, cualquier otro = inactivo)
            const isActive = data === 1;
            const checked = isActive ? 'checked' : '';
            const switchColor = isActive ? '#04a9f5' : '#6c757d';
            
            // Crear el switch toggle
            return `
              <div class="custom-control custom-switch" style="display: inline-block;">
                <input type="checkbox" class="custom-control-input estado-switch" 
                      id="switch-${row.idUsuario}" ${checked}
                      onclick="event.stopPropagation(); window.toggleEstadoUsuario(${row.idUsuario}, this.checked)">
                <label class="custom-control-label" for="switch-${row.idUsuario}" 
                      style="cursor: pointer; border-color: ${switchColor};">
                </label>
              </div>`;
          }
        }
      ],
      serverSide: false,
      processing: false,
      async: true,
      order: [],
      aaSorting: [],
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
      pageLength: 10,
      "lengthMenu": [[10, 25, 50, 100], [10, 25, 50, 100]]
    };
  }

  obtenerPerfil(): void {
    this.sbcCollectionPerfiles = this.perfilService.obtener().subscribe(
      resultado => {
        this.maestroPerfiles = resultado;
      },
      error => {
        console.log('error en obtener perfil ' + error );
      }
    );
  }
  obtenerSede(): void {
    this.sbcCollectionSede = this.sedeService.obtener().subscribe(
      resultado => this.maestroSedes = resultado,
      error => console.log('error en obtener perfil ' + error));
  }
  usuarioListar(): void {
    this.selected = 0;
    this.dataTable.ajax.reload();
  }
  usuarioNuevo(modal: any): void {
    this.idUsuario = 0;
    this.modalUsuarioDatosRef = this.utilsService.abrirModal(modal, 'lg');
    this.modalUsuarioDatosRef.result.then(result =>  this.usuarioListar());
  }
  usuarioEditar(modal: any): void{
    this.modalUsuarioDatosRef = this.utilsService.abrirModal(modal, 'lg');
    this.modalUsuarioDatosRef.result.then(result =>  this.usuarioListar());
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

  // Bottom sheet
  verOpciones(): void{
    if(!this.utilsService.isLargeScreen()){
      this.bottomSheet.open(this.TemplateBottomSheet);
    }
  }
  cerrarOpciones(): void{
    this.bottomSheet.dismiss();
  }
  verClave(): void{
    this.modalUsuarioDatosRef = this.modalService.open(MdlVerClaveComponent,{size: 'md', backdrop: "static", windowClass: 'smodal fade round popins bg-dark-30', keyboard: false, backdropClass: 'bg-transparent', animation: true});
    this.modalUsuarioDatosRef.componentInstance.IdUsuario = this.idUsuario;
  }

  cambiarClave(): void{
    this.modalUsuarioDatosRef = this.modalService.open(MdlCambiarClaveComponent,{size: 'md', backdrop: "static", windowClass: 'smodal fade round popins bg-dark-30', keyboard: false, backdropClass: 'bg-transparent', animation: true});
    this.modalUsuarioDatosRef.componentInstance.Usuario = this.usuarioSelected;
  }

  cambiarEstadoUsuario(idUsuario: number, isActive: boolean) {
    const nuevoEstado = isActive ? 1 : 0;
    
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas ${isActive ? 'activar' : 'desactivar'} este usuario?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        
        const model = new AprobarUsuario();
        model.idUsuario = idUsuario;
        model.estadoAprobacion = nuevoEstado;

        // Llamar al servicio para cambiar estado
        this.usuarioService.cambiarEstadoAprobacion(model).subscribe(
          response => {
            this.spinner.hide();
            if (response && response.status === 200) {
              Swal.fire(
                'Estado actualizado', 
                `El usuario ha sido ${isActive ? 'activado' : 'desactivado'} con éxito`, 
                'success'
              );
              this.usuarioListar(); // Refrescar datos
            } else {
              Swal.fire(
                'Error', 
                'No se pudo actualizar el estado del usuario', 
                'error'
              );
              // Revertir el cambio visual si hay error
              setTimeout(() => {
                const switchElement = document.getElementById(`switch-${idUsuario}`) as HTMLInputElement;
                if (switchElement) switchElement.checked = !isActive;
              }, 0);
            }
          },
          error => {
            this.spinner.hide();
            console.error('Error al cambiar el estado del usuario:', error);
            Swal.fire('Error', 'Ocurrió un problema al actualizar el estado', 'error');
            
            // Revertir el cambio visual si hay error
            setTimeout(() => {
              const switchElement = document.getElementById(`switch-${idUsuario}`) as HTMLInputElement;
              if (switchElement) switchElement.checked = !isActive;
            }, 0);
          }
        );
      } else {
        // Si el usuario cancela, revertir el switch a su estado anterior
        setTimeout(() => {
          const switchElement = document.getElementById(`switch-${idUsuario}`) as HTMLInputElement;
          if (switchElement) switchElement.checked = !isActive;
        }, 0);
      }
    });
  }
}
