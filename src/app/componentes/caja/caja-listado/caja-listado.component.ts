import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import {AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { CajaService } from '../../../shared/services/caja.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from 'src/app/shared/models/usuario';
import { UsuarioService } from '../../../shared/services/usuario.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import {Subscription} from "rxjs";
import Api = DataTables.Api;
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {DatePipe} from "@angular/common";
import {CajaCierreComponent} from "../caja-cierre/caja-cierre.component";
import {EnumTipoPago} from "../../../shared/enumeracion/enums";
import {MdlPdfGoogleViewComponent} from "../../modals/mdl-pdf-google-view/mdl-pdf-google-view.component";
import { PermisoHelper } from 'src/app/shared/helpers/permisos.helper';
import { AuditoriaService } from 'src/app/shared/services/auditoria.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  templateUrl: 'caja-listado.component.html'
})

export class CajaListadoComponent implements OnInit, OnDestroy, AfterViewInit {

  frmFiltroGrilla: FormGroup;

  usuarioActual: Usuario;
  datosCajaDiario: any;
  rutaImageSpinner = '<img src="assets/images/logo-animado.gif" />';

  // Modals
  modalCajaDatosRef: NgbModalRef;
  modalCajaAperturaRef: NgbModalRef;
  modalCajaCuadreRef: NgbModalRef;
  modalCajaCierreRef: NgbModalRef;


  // Datatable
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  dtResponsiveOptions: any = {};
  idCajaSeleccionado = 0;
  selected = 0;
  dataTable: any;
  cajaSeleccionado: any = null;

  // Subscriptions
  sbcCollection: Subscription;
  sbcAbrirCerrarCaja: Subscription;

  @ViewChild('menuMovil') TemplateBottomSheet: TemplateRef<any>;

  cajaSelected: any | undefined;

  modalComprobanteViewRef: NgbModalRef | undefined;

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
    private cajaService: CajaService,
    private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private usuarioService: UsuarioService,
    private spinner: NgxSpinnerService,
    private bottomSheet: MatBottomSheet,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private permisoHelper: PermisoHelper,    
    private auditoriaService : AuditoriaService,
    private router: Router,
  ){ }

  ngOnInit(): void {
    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.inicializarFormulario();
    this.buildtable();
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
    if( this.modalCajaAperturaRef ){ this.modalCajaAperturaRef.close(); }
    if( this.modalCajaCuadreRef ){ this.modalCajaCuadreRef.close(); }
    if( this.modalCajaDatosRef ){ this.modalCajaDatosRef.close(); }
    // Destroy subscription
    if( this.sbcCollection ){ this.sbcCollection.unsubscribe(); }
    if( this.sbcAbrirCerrarCaja ){ this.sbcAbrirCerrarCaja.unsubscribe(); }
    this.modalCajaCierreRef?.close();
    this.modalComprobanteViewRef?.close();
  }

  inicializarFormulario(): void {
    this.frmFiltroGrilla = this.formBuilder.group({
      filterCaja: ['']
    });
  }

  ngAfterViewInit(): void{

    const _this = this;
    this.datatableElement.dtInstance.then((dtInstance: any) => {

      _this.dataTable = dtInstance;

      dtInstance.on('select', function (e, dt, type, indexes ) {
        if ( type === 'row' ) {
          const data = dtInstance.rows('.selected').data()[0];

          _this.idCajaSeleccionado = data.id;
          _this.datosCajaDiario = {
             id: data.id,
             descripcion: data.descripcion
           }
           _this.cajaSeleccionado = data;

          _this.verOpciones();
        }
        _this.selected = dtInstance.rows({ selected: true }).count();
      });
      dtInstance.on('deselect', function (e, dt, type, indexes ) {
        _this.cajaSeleccionado = null;
        _this.idCajaSeleccionado = 0;
        _this.selected = dtInstance.rows({ selected: true }).count();
      });
   });
  }

  buildtable(): void{
    this.dtResponsiveOptions = {
      ajax: (dataTablesParameters: any, callback) => {
        const strFiltro = this.frmFiltroGrilla.controls.filterCaja.value;
        const mensajeError = 'Error al obtener cajas';

        this.spinner.show();

        strFiltro === '' ?
          this.sbcCollection = this.cajaService.obtener().subscribe(
            resultado => {
              callback({ data : resultado });
              this.spinner.hide();
            },
            error => {
             console.log(mensajeError, error);
             this.spinner.hide();
            }
          )
          :
          this.sbcCollection = this.cajaService.searchByLikeNombre(strFiltro).subscribe(
            resultado => {
              callback({ data: resultado, })
              this.spinner.hide();
            },
            error => {
              console.log(mensajeError, error);
              this.spinner.hide();
            }
          );
      },
      select: {
        selector: 'td:not(:first-child)'
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
        { title: 'ID', data: 'id', width: '4%', visible: false },
        { title: 'DESCRIPCION', data: 'descripcion', width: '20%' },
        { title: 'SEDE', data: 'sede', width: '20%' },
        { title: 'APERTURA', data: 'apertura', width: '20%' },
        { title: 'RESPONSABLE APERTURA', data: 'usuarioResponsable', width: '20%' },
        { title: 'RESPONSABLE CIERRE', data: 'usuarioResponsableCierre', width: '20%' },
        { title: 'TURNO', data: 'turno', width: '20%' },
        { title: 'ÚLTIMA APERTURA', data: 'fechaHoraApertura', width: '20%', render: (data: string) => {
            const fecha = new Date(data);
            return `<span class="d-block small text-dark">${this.datePipe.transform(fecha, 'yyyy-MM-dd')}</span><span class="d-block small text-dark">${this.datePipe.transform(fecha, 'hh:mm:ss a')}</span>`;
        }},
        { title: 'ÚLTIMO CIERRE', data: 'fechaHoraCierre', width: '20%', render: (data: string | null) => {
            const fecha = new Date(data);
            return data ? `<span class="d-block small text-dark">${this.datePipe.transform(fecha, 'yyyy-MM-dd')}</span><span class="d-block small text-dark">${this.datePipe.transform(fecha, 'hh:mm:ss a')}</span>` : '';
        }},
        { title: 'ESTADO', width: '5%', data: 'idEstado', visible: false, render: (data) => {
            return data === 1 ? '<span class="small theme-bg text-white p-1 estado rounded">ACTIVO</span>' : '<span class="small theme-bg2 text-white p-1 estado rounded">INACTIVO</span>';
          },
        },
      ],
      serverSide: false,
      processing: false,
      async: true,
      buttons: [
        'excel'
      ],
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

  cajaListar(): void {
    this.dataTable.ajax.reload();
  }

  cajaNuevo(modal: NgbModalRef): void {
    this.idCajaSeleccionado = 0;
    this.modalCajaDatosRef = this.utilsService.abrirModal(modal, 'md');
    this.modalCajaDatosRef.result.then(result => this.cajaListar());
  }
  cajaEditar(modal: NgbModalRef): void {
    this.modalCajaDatosRef = this.utilsService.abrirModal(modal, 'md');
    this.modalCajaDatosRef.result.then(result => this.cajaListar());
  }
  cajaCuadre(modal: NgbModalRef): void {
    // this.modalCajaCuadreRef = this.utilsService.abrirModal(modal, 'md');

    this.spinner.show();
    this.cajaService.obtenerCuadreCaja(this.datePipe.transform(new Date(), 'yyyy-MM-dd'), this.cajaSeleccionado.id, this.usuarioService.UsuarioActual.idUsuario).subscribe(
      resultado => {
        if(resultado.status !== 200){
          this.utilsService.mostrarToast(resultado.error,'error');
          this.spinner.hide();
          return;
        }

        this.verCuadre(resultado.data, this.cajaSeleccionado);
        this.spinner.hide();
      },
      error => {
        console.log('Error al obtener el cuadre de caja', error);
        this.spinner.hide();
      }
    );


  }
  cajaAbrirCerrar(abrirCaja: boolean, modal: NgbModalRef): void {
    const mensajePregunta = abrirCaja ? '¿Desea aperturar la caja?' : '¿Desea cerrar la caja?'
    this.datosCajaDiario.abrirCaja = abrirCaja;
    this.datosCajaDiario.idUsuarioResponsable = this.usuarioActual.idUsuario;

    Swal.fire({
      title: mensajePregunta,
      icon: 'info',
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      showCancelButton: true
    }).then(
      result => {

        if(result.isConfirmed) {
          if(abrirCaja){
            //Apertura
            this.modalCajaAperturaRef = this.utilsService.abrirModal(modal, 'md');
            this.modalCajaAperturaRef.result.then(result => {this.cajaListar(); this.cajaSeleccionado = null; });

          } else {
            //Cierre
            this.sbcAbrirCerrarCaja = this.cajaService.abrirCerrar(this.datosCajaDiario).subscribe(
              resultado => {
                if (resultado.exito) {
                  this.utilsService.mostrarToast(resultado.mensaje, 'success');
                  this.cajaListar();
                  this.cajaSeleccionado = null;
                } else {
                  this.utilsService.mostrarToast(resultado.mensaje, 'error');
                }
              },
              error => console.log("Error al abrir o cerrar la caja", error)
            );
          }

        }
      }
    );
  }

  cerrarCaja(): void{
    this.modalCajaCierreRef = this.modalService.open(CajaCierreComponent,{
      // size: 'xl mw-100 mx-md-4',
      size: 'md',
      backdrop: "static",
      windowClass: 'smodal fade round popins bg-dark-30',
      keyboard: false,
      backdropClass: 'bg-transparent',
      animation: true
    });
    this.modalCajaCierreRef.componentInstance.cajaDiario = this.cajaSeleccionado;
    this.modalCajaCierreRef.componentInstance.OnUpdated.subscribe(_ => {
      this.cajaListar();
      this.cajaSeleccionado = null;
    });
    console.log('caja', this.cajaSeleccionado);
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


  /*********************************************************************************************
   * Eventos
   */
  verCuadre(res: any, cajaSeleccionada: any): void{
    const documentDefinition = this.ticketCuadreCaja(res, cajaSeleccionada);
    const pdf = pdfMake.createPdf(documentDefinition);


    pdf.getDataUrl(async (dataURL: any) => {
      const pdfstr = await fetch(dataURL);
      const blobFromFetch = await pdfstr.blob();
      const blob = new Blob([blobFromFetch], {type: "application/pdf"});
      const blobUrl = URL.createObjectURL(blob);

      this.modalComprobanteViewRef = this.modalService.open(MdlPdfGoogleViewComponent, {
        // size: 'xl mw-100 mx-md-4',
        size: 'lg w-100 max-w-600px',
        backdrop: "static",
        windowClass: 'smodal fade round popins bg-dark-30',
        keyboard: false,
        backdropClass: 'bg-transparent',
        animation: true,
        scrollable: true
      });
      this.modalComprobanteViewRef.componentInstance.Url = blobUrl;

    });

  }
  ticketCuadreCaja(model: any, cajaSeleccionada: any): any {

    const lineaSeparacion = '------------------------------------------------------------------------------------------';
    const dd: any = {
      content: [
        { text: 'CUADRE DE CAJA',       bold: true,   fontSize: 10,     margin: [0, 5, 0, 0],   alignment: 'center',    style: 'name'      },
        //{ text: lineaSeparacion,                            bold: false,  fontSize: 8,      margin: [0, 2, 0, 0],   alignment: 'center',    style: 'name'      },
        {
          table: {
            widths: [70,'*'],
            body: [
              [
                { text: 'FECHA', bold: true, fontSize: 8, alignment: 'left', border:[false,true,false,false], margin: [0,10,0,0]},
                { text: this.datePipe.transform(new Date(), 'dd/MM/yyyy, h:mm a'), bold: true, fontSize: 8, alignment: 'right' , border:[false,true,false,false], margin: [0,10,0,0]},
              ],
              [
                { text: 'SEDE', bold: true, fontSize: 8, alignment: 'left', border:[false,false,false,false]},
                { text: cajaSeleccionada.sede, bold: true, fontSize: 8, alignment: 'right' , border:[false,false,false,false]},
              ],
              [
                { text: 'CAJA', bold: true, fontSize: 8, alignment: 'left', border:[false,false,false,false]},
                { text: cajaSeleccionada.descripcion, bold: true, fontSize: 8, alignment: 'right' , border:[false,false,false,false]},
              ],
              [
                { text: 'RESPONSABLE', bold: true, fontSize: 8, alignment: 'left', border:[false,false,false,true], margin: [0,0,0,10]},
                { text: this.usuarioActual.nombre, bold: true, fontSize: 8, alignment: 'right', border:[false,false,false,true], margin: [0,0,0,10] },
              ],
            ],
          },
          layout: {
            hLineWidth: function (i, node) {
              return 1;
            },
            vLineWidth: function (i, node) {
              return .5;
            },
            hLineColor: function (i, node) {
              return 'black';
            },
            vLineColor: function (i, node) {
              return 'black';
            },
            hLineStyle: function (i, node) {
              return {dash: {length: 2, space: 2}};
            },
            vLineStyle: function (i, node) {
              return {dash: {length: 2}};
            },
            // paddingLeft: function(i, node) { return 4; },
            // paddingRight: function(i, node) { return 4; },
            // paddingTop: function(i, node) { return 2; },
            // paddingBottom: function(i, node) { return 2; },
            // fillColor: function (i, node) { return null; }
          }
        },

        { text: 'RESUMEN DEL DÍA',       bold: true,   fontSize: 10,     margin: [0, 5, 0, 5],   alignment: 'center',    style: 'name'      },


        // { text: lineaSeparacion,                            bold: false,  fontSize: 8,      margin: [0, 2, 0, 0],   alignment: 'center',    style: 'name'      },
        // { columns :
        //     [
        //       { text: 'INGRESO VENTA:',      fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],   alignment: 'left' },
        //       { text: 'S/',  fontSize: 8,  bold: false,  margin: [0, 2, 0, 0], alignment: 'right' },
        //       { text: this.datosCuadre.ingreso.toFixed(2).toString(),       fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],     alignment: 'right' },
        //     ]
        // },
        // { columns :
        //     [
        //       { text: 'SALDO INICIAL:',  fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],      alignment: 'left' },
        //       { text: 'S/',  fontSize: 8,  bold: false,  margin: [0, 2, 0, 0], alignment: 'right' },
        //       { text: this.datosCuadre.saldoInicial.toFixed(2).toString(),    fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],      alignment: 'right' },
        //     ]
        // },
        // { columns :
        //     [
        //       { text: 'GASTO DEL DIA:',  fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],      alignment: 'left' },
        //       { text: 'S/',  fontSize: 8,  bold: false,  margin: [0, 2, 0, 0], alignment: 'right' },
        //       { text: this.datosCuadre.egreso.toFixed(2).toString(),    fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],      alignment: 'right' },
        //     ]
        // },
        // { text: lineaSeparacion, bold: false,  fontSize: 8, margin: [0, 2, 0, 0],   alignment: 'center',    style: 'name'      },
        // { columns :
        //     [
        //       { text: 'TOTAL EFECTIVO:',  fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],      alignment: 'left' },
        //       { text: 'S/',  fontSize: 8,  bold: false,  margin: [0, 2, 0, 0], alignment: 'right' },
        //       { text: this.datosCuadre.total.toFixed(2).toString(),    fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],      alignment: 'right' },
        //     ]
        // },
        // { text: lineaSeparacion, bold: false,  fontSize: 8, margin: [0, 2, 0, 0],   alignment: 'center',    style: 'name'      },
        // { columns :
        //     [
        //       { text: 'USUARIO:',  fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],      alignment: 'left' },
        //       { text: this.usuarioActual.nombre,    fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],      alignment: 'right' },
        //     ]
        // },
        // { columns :
        //     [
        //       { text: 'FECHA IMPRESIÓN:',  fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],      alignment: 'left' },
        //       { text: this.utilsService.formato_FechaFullString(new Date(), '-', ':'),    fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],      alignment: 'right' },
        //     ]
        // }
      ],
      styles: {
        header: {
          fontSize: 8,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 8,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 0, 0, 0]
        },
        tableHeader: {
          bold: true,
          fontSize: 8,
          color: 'black',
          margin: [0, 0, 0, 0]
        },
        tableBody: {
          fontSize: 8,
          color: 'black',
          margin: [0, 0, 0, 0]
        },
        name: {
          fontSize: 8,
          bold: true,
          alignment: 'center',
          margin: [0, 20, 0, 10],
        }
      },
      defaultStyle: {
      },
      pageMargins: [5,5,5,0],
      pageSize: { height: 'auto',  width: 210  }
    }

    model.aperturas.forEach((x: any) => {

      const table = {
        table: {
          widths: ['*','*'],
          body: []
        },
        layout: {
          hLineWidth: function (i, node) {
            return 1;
          },
          vLineWidth: function (i, node) {
            return .5;
          },
          hLineColor: function (i, node) {
            return 'black';
          },
          vLineColor: function (i, node) {
            return 'black';
          },
          hLineStyle: function (i, node) {
            return {dash: {length: 2, space: 2}};
          },
          vLineStyle: function (i, node) {
            return {dash: {length: 2}};
          },
        }};
      table.table.body.push(
        [
          { text: 'TURNO', bold: true, fontSize: 10, alignment: 'left', border:[false,true,false,false], margin: [0,10,0,0]},
          { text: x.turno, bold: true, fontSize: 10, alignment: 'right', border:[false,true,false,false], margin: [0,10,0,0]},
        ]
      );
      table.table.body.push(
        [
          { text: 'HORA APERTURA', bold: true, fontSize: 8, alignment: 'left', border:[false,false,false,false], margin: [0,0,0,0]},
          { text: this.datePipe.transform(new Date(x.fechaHoraApertura), 'hh:mm:ss a'), bold: false, fontSize: 8, alignment: 'right', border:[false,false,false,false], margin: [0,0,0,0]},
        ]
      );
      table.table.body.push(
        [
          { text: 'HORA CIERRE', bold: true, fontSize: 8, alignment: 'left', border:[false,false,false,false], margin: [0,0,0,0]},
          { text: (x.fechaHoraCierre ? this.datePipe.transform(new Date(x.fechaHoraCierre), 'hh:mm:ss a') : 'No hay cierre' ), bold: false, fontSize: 8, alignment: 'right', border:[false,false,false,false], margin: [0,0,0,0]},
        ]
      );
      table.table.body.push(
        [
          { text: 'SALDO EFECT. INICIAL', bold: true, fontSize: 8, alignment: 'left', border:[false,false,false,false], margin: [0,0,0,0]},
          { text: `S/ ${x.saldoInicial.toFixed(2)}`, bold: false, fontSize: 8, alignment: 'right', border:[false,false,false,false], margin: [0,0,0,0]},
        ]
      );
      table.table.body.push(
        [
          { text: 'SALDO EFECT. FINAL', bold: true, fontSize: 8, alignment: 'left', border:[false,false,false,false], margin: [0,0,0,0]},
          { text: `S/ ${x.saldoCierre.toFixed(2)}`, bold: false, fontSize: 8, alignment: 'right', border:[false,false,false,false], margin: [0,0,0,0]},
        ]
      );

      model.cuadres.filter(c => c.turno === x.turno).forEach( cd => {
        if(cd.idTipoPago !== EnumTipoPago.MIXTO){
          table.table.body.push(
            [
              { text: cd.tipoPago.toUpperCase(), bold: true, fontSize: 8, alignment: 'left', border:[false,false,false,false], margin: [0,0,0,0]},
              { text: `S/ ${cd.total.toFixed(2)}`, bold: false, fontSize: 8, alignment: 'right', border:[false,false,false,false], margin: [0,0,0,0]},
            ]
          );
        }else{
          table.table.body.push(
            [
              { text: 'EFECTIVO MIXTO', bold: true, fontSize: 8, alignment: 'left', border:[false,false,false,false], margin: [0,0,0,0]},
              { text: `S/ ${cd.pagoEfectivo.toFixed(2)}`, bold: false, fontSize: 8, alignment: 'right', border:[false,false,false,false], margin: [0,0,0,0]},
            ]
          );
          table.table.body.push(
            [
              { text: 'TARJETA MIXTO', bold: true, fontSize: 8, alignment: 'left', border:[false,false,false,false], margin: [0,0,0,0]},
              { text: `S/ ${cd.pagoTarjeta.toFixed(2)}`, bold: false, fontSize: 8, alignment: 'right', border:[false,false,false,false], margin: [0,0,0,0]},
            ]
          );
        }
      });

      dd.content.push(table);

      let totalVenta: number = 0;
      let totalEfectivo: number = 0;
      model.cuadres.filter(c => c.turno === x.turno).forEach( async (cd: any) => {
        totalVenta += cd.total;
        totalEfectivo += cd.pagoEfectivo;
        if(cd.idTipoPago === EnumTipoPago.EFECTIVO){
          totalEfectivo += cd.total;
        }
      });
      totalEfectivo += x.saldoInicial;
      dd.content.push({
        table: {
          widths: ['*', '*'],
          body: [
            [
              {
                text: 'TOTAL VENTA',
                bold: true,
                fontSize: 8,
                alignment: 'left',
                border: [false, true, false, false],
                margin: [0, 0, 0, 0]
              },
              {
                text: `S/ ${totalVenta.toFixed(2)}`,
                bold: true,
                fontSize: 8,
                alignment: 'right',
                border: [false, true, false, false],
                margin: [0, 0, 0, 0]
              },
            ],
            [
              {
                text: 'TOTAL EFECTIVO',
                bold: true,
                fontSize: 8,
                alignment: 'left',
                border: [false, false, false, false],
                margin: [0, 0, 0, 0]
              },
              {
                text: `S/ ${totalEfectivo.toFixed(2)}`,
                bold: true,
                fontSize: 8,
                alignment: 'right',
                border: [false, false, false, false],
                margin: [0, 0, 0, 0]
              },
            ]
          ]
        }
      });

    });




    let totalVenta: number = 0;
    let totalEfectivo: number = 0;
    model.cuadres.forEach( async (cd: any) => {
      totalVenta += cd.total;
      totalEfectivo += cd.pagoEfectivo;
      if(cd.idTipoPago === EnumTipoPago.EFECTIVO){
        totalEfectivo += cd.total;
      }
    });
    // totalEfectivo +=
    dd.content.push({
      table: {
        widths: ['*', '*'],
        body: [
          [
            {
              text: 'TOTAL VENTA',
              bold: true,
              fontSize: 10,
              alignment: 'left',
              border: [false, true, false, false],
              margin: [0, 10, 0, 0]
            },
            {
              text: `S/ ${totalVenta.toFixed(2)}`,
              bold: true,
              fontSize: 10,
              alignment: 'right',
              border: [false, true, false, false],
              margin: [0, 10, 0, 0]
            },
          ],
          // [
          //   {
          //     text: 'TOTAL EFECTIVO',
          //     bold: true,
          //     fontSize: 10,
          //     alignment: 'left',
          //     border: [false, false, false, false],
          //     margin: [0, 0, 0, 0]
          //   },
          //   {
          //     text: `S/ ${totalEfectivo.toFixed(2)}`,
          //     bold: true,
          //     fontSize: 10,
          //     alignment: 'right',
          //     border: [false, false, false, false],
          //     margin: [0, 0, 0, 0]
          //   },
          // ]
        ]
      },
      layout: {
        vLineStyle: function (i, node) {
          if (i === 0 || i === node.table.widths.length) {
            return null;
          }
          return {double: {length: 4}};
        },
      }
    });


    dd.content.push({ text: '',       bold: true,   fontSize: 10,     margin: [0, 5, 0, 50],   alignment: 'center'  });
    dd.content.push({
      table: {
        widths: ['*'],
        body: [
          [
            { text: 'FIRMA RESPONSABLE', bold: true, fontSize: 8, alignment: 'center', border:[false,true,false,false], margin: [0,0,0,0]}
          ],
        ],
      },
      layout: {
        hLineWidth: function (i, node) {
          return 1;
        },
        vLineWidth: function (i, node) {
          return .5;
        },
        hLineColor: function (i, node) {
          return 'black';
        },
        vLineColor: function (i, node) {
          return 'black';
        },
        hLineStyle: function (i, node) {
          return {dash: {length: 2, space: 2}};
        },
        vLineStyle: function (i, node) {
          return {dash: {length: 2}};
        },
        // paddingLeft: function(i, node) { return 4; },
        // paddingRight: function(i, node) { return 4; },
        // paddingTop: function(i, node) { return 2; },
        // paddingBottom: function(i, node) { return 2; },
        // fillColor: function (i, node) { return null; }
      }
    })
    dd.content.push({ text: '-',       bold: true,   fontSize: 10,     padding: [0, 5, 0, 50], margin: [0, 0, 0, 50],   alignment: 'center'  });

    return dd;
  }

}



