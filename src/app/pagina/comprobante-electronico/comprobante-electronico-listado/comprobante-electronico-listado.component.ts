import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from "@angular/common";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../../shared/services/auth.service";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import {BehaviorSubject, Subscription} from "rxjs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {FlatpickrOptions} from "ng2-flatpickr";
import Spain from "flatpickr/dist/l10n/es";
import {TipoComprobanteService} from "../../../shared/services/tipo-comprobante.service";
import {TipoComprobante} from "../../../shared/models/tipo-comprobante";
import {EnumTipoComprobante, TipoPerfil} from "../../../shared/enumeracion/enums";
import {Sede} from "../../../shared/models/sede";
import {SedeService} from "../../../corporal360/shared/service/sede.service";
import {ComprobanteElectronicoService} from "../../../shared/services/facturacion/comprobante-electronico.service";
import {
  ComprobanteElectronicoReporte,
  ComprobanteElectronicoValidar
} from 'src/app/shared/models/facturacion/comprobante-electronico';
import {ErrorSistema} from 'src/app/shared/models/error-sistema';
import {DataTableDirective} from "angular-datatables";
import {MdlPdfGoogleViewComponent} from "../../../componentes/modals/mdl-pdf-google-view/mdl-pdf-google-view.component";


import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {EmpresaService} from "../../../shared/services/empresa.services";
import {NumeroALetras} from "../../../shared/services/funciones/numero-letras.service";
import {MdlAnularComprobanteComponent} from "../../../componentes/modals/mdl-anular-comprobante/mdl-anular-comprobante.component";
import {MdlMotivoAnulacionComprobanteComponent} from "../../../componentes/modals/mdl-motivo-anulacion-comprobante/mdl-motivo-anulacion-comprobante.component";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-comprobante-electronico-listado',
  templateUrl: './comprobante-electronico-listado.component.html',
  styleUrls: ['./comprobante-electronico-listado.component.scss']
})
export class ComprobanteElectronicoListadoComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;

  loading = false;
  _loading = new BehaviorSubject<boolean>(false);

  usuarioActual: any;
  ldSubmit = false;
  submitted = false;
  subscription: Subscription | undefined;

  dtResponsiveOptions: any = {};
  dataTable: any;

  formGroup: FormGroup;
  sbcCollection: Subscription | undefined;
  // collection: CitaSinSiguienteCita[] =[];
  ldCollection: boolean;

  flatOptions: FlatpickrOptions = {
    locale: Spain.es,
    mode: 'single',
    altFormat: 'd F Y',
    dateFormat: 'Y-m-d',
    altInput: true,
    allowInput: false,
    altInputClass: 'form-control form-indigo form-control-sm text-center',
    defaultDate: new Date()
  };


  flatOptions2: FlatpickrOptions = {
    locale: Spain.es,
    mode: 'single',
    altFormat: 'd F Y',
    dateFormat: 'Y-m-d',
    altInput: true,
    allowInput: false,
    altInputClass: 'form-control form-indigo form-control-sm text-center border-right-0',
    defaultDate: new Date()
  };

  fechaDesde: string;
  fechaHasta: string;


  /************ tipos de collection **************/
  ldTiposComprobante: boolean;
  sbcTiposComprobante: Subscription | undefined;
  tiposComprobante: TipoComprobante[] = [];


  /************ sedes **************/
  ldSedes: boolean;
  sbcSedes: Subscription | undefined;
  sedes: Sede[] = [];

  modalAnularComprobanteRef: NgbModalRef;
  modalComprobanteViewRef: NgbModalRef;
  sbcEmisionTicket: Subscription | undefined;

  collection: ComprobanteElectronicoReporte[] = [];
  selected: ComprobanteElectronicoReporte | null = null;
  ldView: boolean;

  ldValidando: boolean;


  sbcAnularComprobante: Subscription | undefined;

  constructor(
    private auth: AuthService,
    private utilsService: UtilsService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private tipoComprobanteService: TipoComprobanteService,
    private sedeService: SedeService,
    private api: ComprobanteElectronicoService,
    private empresaService: EmpresaService,
    private numeroALetras: NumeroALetras,
  ) {
    this.ldValidando = false;
    this.ldView = false;
  }

  ngOnInit(): void {
    this.render();
    this.usuarioActual = this.auth.getUser();

    this.formGroup = this.formBuilder.group({
      fechaDesde: new FormControl(null, Validators.required),
      fechaHasta: new FormControl(null, Validators.required),
      idTipoComprobante: new FormControl(0, Validators.required),
      idSede: new FormControl(0, Validators.required),
    });
    this.formGroup.get('fechaDesde').valueChanges.subscribe((res) => {
      if(res){
        this.fechaDesde = this.datePipe.transform(res[0], 'yyyy-MM-dd');
      }
    });
    this.formGroup.get('fechaHasta').valueChanges.subscribe((res) => {
      if(res){
        this.fechaHasta = this.datePipe.transform(res[0], 'yyyy-MM-dd');
      }
    });

    this.formGroup.patchValue({
      fechaDesde: [new Date()],
      fechaHasta: [new Date()]
    });

    this.submitted = true;
    this.render();

  }

  ngOnDestroy(): void {
    this.sbcCollection?.unsubscribe();
    this.sbcEmisionTicket?.unsubscribe();
    this.modalComprobanteViewRef?.close();
    this.sbcAnularComprobante?.unsubscribe();
    this.modalAnularComprobanteRef?.close();
  }

  ngAfterViewInit(): void {


    this.datatableElement.dtInstance.then((dtInstance: any) => {

      this.dataTable = dtInstance;

      dtInstance.on('select',  (e, dt, type, indexes ) => {;
        if ( type === 'row' ) {
          this.selected = dtInstance.rows('.selected').data()[0];
        }
      });

      dtInstance.on('deselect', (e, dt, type, indexes ) => {
        this.selected = null ;
      });
    });


    this.obtenerTiposComprobante();
    this.obtenerSedes();
  }

  /**************************************************************************************
   * Getters
   */
  get f(): any{
    return this.formGroup.controls;
  }


  render(): void{
    this.dtResponsiveOptions = {
      ajax: (dataTablesParameters: any, callback) => {

        if(!this.submitted){
          callback({ data : [] });
        }else{

          const idSede = parseInt(this.f.idSede.value, 10);
          const idTipoComprobante = parseInt(this.f.idTipoComprobante.value, 10);

          this.subscription?.unsubscribe();
          this.loading = true;
          this._loading.next(true);
          this.subscription = this.api.obtenerReporte(this.usuarioActual.id, idSede, idTipoComprobante, this.fechaDesde, this.fechaHasta).subscribe( (res: ComprobanteElectronicoReporte[] | ErrorSistema) => {
            if(res instanceof ErrorSistema){
              this.collection = [];
              callback({ data : [] });
              this.utilsService.mostrarToast(res.message,'error');
            }else{
              callback({
                data : res
              });
              this.collection = res;
              // console.log(res);
            }
            this.loading = false;
            this._loading.next(false);
          }, err =>  {
            callback({ data : [] });
            this.collection = [];
            this.loading = false;
            this._loading.next(false)
            console.log('Error al obtener el cronograma de citas atendidas: ', err);
            this.utilsService.mostrarToast('Error al obtener el cronograma de citas atendidas','error');
          });

        }
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
        { title: '', data: null, visible: true, "orderable":      false, render: (data,type,row) => {
            return '<button class="btnVer btn btn-primary btn-sm m-0 p-0 w-25px h-25px rounded-sm d-inline-flex" title="Ver"><i class="fa-light fa-eye m-auto"></i></button>';
          }},
        { title: '', data: null, visible: true, "orderable":      false, render: (data,type,row) => {
          return `<button ${row.idEstado === 29 ? 'disabled' : ''} class="btnAnular btn btn-secondary btn-sm m-0 p-0 w-25px h-25px rounded-sm ${ [TipoPerfil.ADMINISTRADOR, TipoPerfil.SA, TipoPerfil.SISTEMAS].includes(this.auth.getUser().rol.id) ? 'd-inline-block' : 'd-none' }" title="Anular"><i class="fa-light fa-ban m-auto"></i></button>`;
        }},
        { title: 'IDCITA', data: 'idCita', visible: false},
        // { title: 'COMPROBANTE', data: 'serie', render: (data: any, type, row) => {
        //     return `${row.serie}-${row.numero}`;
        //   }},
        { title: 'SERIE', data: 'serie', visible: true},
        { title: 'NÚMERO', data: 'numero', visible: true},
        { title: 'ESTADO', width: '5%', data: 'idEstado',
          render(data): any {
            switch (data){
              case 28: return '<span class="label theme-bg-green">EMITIDO</span>';
              case 29: return '<span class="label theme-bg-red f-12">ANULADO</span>';
            }
          }
        },
        { title: 'T. COMPROBANTE', data: 'tipoComprobante', visible: true},
        { title: 'CITA', data: 'idCita', render: (data: any, type, row) => {
            return `<a href='/Cita/${parseInt(data, 10).toString()}/1/${row.idCliente}/0' target='_blank''>${ data }</a>`;
          }},
        { title: 'CLIENTE', data: 'cliente', visible: false},
        { title: 'CLIENTE', data: 'cliente', render: (data: any, type, row) => {
            return  `<a href='/ClientePerfil/${row.idCliente}' target='_blank''>${ data }</a>`;
          }},
        { title: 'SEDE', data: 'sede', visible: true},
        { title: 'TOTAL', data: 'total', visible: false, render: (data: number) =>{
            return `${data.toFixed(2)}`
          }},
        { title: 'TOTAL', data: 'total', visible: true, render: (data: number) =>{
          return `S/ ${data.toFixed(2)}`
        }},
        // { title: 'ANULADO. SUNAT', data: 'anuladoSunat', visible: true, render: (data: boolean, type, row) =>{
        //     return data ? '<span class="small bg-danger text-white rounded-md px-2 py-1">SI</span>' : '<span class="small bg-success text-white rounded-md px-2 py-1">NO</span>'
        // }},
        { title: 'E. SUNAT', data: null, render: (data, xhr, row) => {
            return `<span class="rounded text-uppercase text-white px-2 fw-bold" style="background-color: ${row.estadoSunatColor}">${row.estadoSunat}</span> ${ row.validando ? '<i class="fa-regular fa-loader fa-spin"></i>' : '' }`;
          }},
        { title: 'F. REGISTRO', data: 'fechaRegistro', render: (data: Date | null) => {
            return data ? this.datePipe.transform(data,'yyyy-MM-dd') : null;
          }},
        { title: 'H. REGISTRO', data: 'fechaRegistro', render: (data: Date | null) => {
            return data ? this.datePipe.transform(data,'hh:mm:ss') : null;
          }},
        { title: 'U. REGISTRO', data: 'usuarioRegistro'},
        // { title: 'H. REGISTRO', data: 'fechaRegistro', render: (data: Date) => {
        //     return this.datePipe.transform(data,'hh:mm:ss');
        //   }},
      ],
      "fnRowCallback": (nRow, aData: ComprobanteElectronicoReporte, iDisplayIndex) => {
        // nRow.setAttribute('id',aData[0]);
        nRow.querySelector('.btnVer').addEventListener('click', () => {

          this.selected = aData;
          this.ldView = true;
          this.sbcEmisionTicket = this.empresaService.obtenerEmpresaEmisionTicket(aData.idCita).subscribe(
            async resultado => {

              if(resultado.idTipoComprobante === EnumTipoComprobante.TICKET){

                const documentDefinition = this.getTicketEstructura(resultado);
                const pdf = pdfMake.createPdf(documentDefinition);

                // const documentDefinition = this.getTicketEstructura(resultado);
                // const pdf = pdfMake.createPdf(documentDefinition);
                pdf.getDataUrl(async (dataURL: any) => {
                  const pdfstr = await fetch(dataURL);
                  const blobFromFetch = await pdfstr.blob();
                  const blob = new Blob([blobFromFetch], {type: "application/pdf"});
                  const blobUrl = URL.createObjectURL(blob);

                  this.ldView = false;
                  this.modalComprobanteViewRef = this.modalService.open(MdlPdfGoogleViewComponent, {
                    // size: 'xl mw-100 mx-md-4',
                    size: 'lg w-100 max-w-600px',
                    windowClass: 'smodal fade2 round popins bg-dark-30',
                    keyboard: false,
                    backdrop: "static",
                    backdropClass: 'bg-transparent',
                    animation: true,
                    scrollable: true
                  });
                  this.modalComprobanteViewRef.componentInstance.Url = blobUrl;

                });

              }else{

                const pdfstr = await fetch(`data:application/pdf;base64,${resultado.boletaPdfBase64}`);
                const blobFromFetch= await pdfstr.blob();
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
              }
            },
            error => console.log('Error al obtener los datos de la empresa', error));

        }, false);

        nRow.querySelector('.btnAnular').addEventListener('click', () => {

          this.modalAnularComprobanteRef = this.modalService.open(MdlAnularComprobanteComponent, {
            // size: 'xl mw-100 mx-md-4',
            size: 'lg w-100 max-w-600px',
            backdrop: "static",
            windowClass: 'smodal fade round popins bg-dark-30',
            keyboard: false,
            backdropClass: 'bg-transparent',
            animation: true,
            scrollable: true
          });
          this.modalAnularComprobanteRef.componentInstance.data = aData;
          this.modalAnularComprobanteRef.componentInstance.OnCreated.subscribe((res) => {
            this.modalAnularComprobanteRef.close();
            this.reload(false);
          });

        }, false);
      },
      serverSide: false,
      processing: false,
      async: true,
      buttons: [
        {
          extend: 'excelHtml5',
          // title: this.getTitleExel(),
          autoFilter: true,
          sheetName: 'Data',
          // exportOptions: {
          //   columns: [1,3,4,5,6,8,9,10,11,12,13,14,16,17,18,19]
          // }
        },
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
      },
      select: false,
      dom: "<'row mx-0'<'col-sm-6'l><'col-sm-6'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row mx-0'<'col-sm-5 py-2'i><'col-sm-7 py-2'p>>",
    };
  }



  /**************************************************************************************
   * Events
   */
  evtOnSubmit(): void{
    if(this.formGroup.invalid){
      this.utilsService.mostrarToast('Debe seleccionar un rango de fecha', 'warning');
      console.log(this.formGroup);
      return;
    }

    if( this.f.fechaDesde.value[0].getTime() > this.f.fechaHasta.value[0].getTime() ){
      this.utilsService.mostrarToast('La fecha inicial debe ser menor', 'warning');
      return;
    }

    this.submitted = true;
    this.dataTable.ajax.reload();

  }
  evtImprimir(): void{
    this.dataTable?.button(0).trigger();
  }

  evtVerMotivo(): void{
    console.log(this.selected);
    this.modalAnularComprobanteRef = this.modalService.open(MdlMotivoAnulacionComprobanteComponent, {
      // size: 'xl mw-100 mx-md-4',
      size: 'lg w-100 max-w-600px',
      backdrop: "static",
      windowClass: 'smodal fade round popins bg-dark-30',
      keyboard: false,
      backdropClass: 'bg-transparent',
      animation: true,
      scrollable: true
    });
    this.modalAnularComprobanteRef.componentInstance.comprobante = this.selected;
  }

  async evtValidar(): Promise<void>{
    await this.collection.forEach(x => {
      x.validando = true;
    });
    await this.dataTable.clear().rows.add(this.collection).draw();

    await this.validarComprobantes();

  }
  reload( reset: boolean = true ): void{
    this.dataTable.ajax.reload(null,reset);
  }


  /**************************************************************************************
   * Data
   */
  obtenerTiposComprobante(): void{
    this.ldTiposComprobante = true;
    this.sbcTiposComprobante = this.tipoComprobanteService.obtener().subscribe((res: any[]) => {
      this.tiposComprobante = res.filter(x => x.id !== EnumTipoComprobante.TICKET).map(x => {
          const m = new TipoComprobante();
          m.id = x.id;
          m.descripcion = x.descripcion;
          return m;
      });
      this.ldTiposComprobante = false
    }, error => {
      console.log(error);
      this.ldTiposComprobante = false
    });
  }
  obtenerSedes(): void{
    this.ldSedes = true;
    this.sbcSedes = this.sedeService.listar().subscribe((res: Sede[]) => {
      this.sedes = res;
      this.ldSedes = false;
    }, error => {
      console.log(error);
      this.ldSedes = false
    });
  }
  async validarComprobantes(): Promise<void> {

    return new Promise(async (resolve, reject) => {

      // const collection: PhonesNum[] = [];
      this.ldValidando = true;
      for (const [i, item] of this.collection.entries()) {

        if( item.validando === true ){
          await this.api.consultar(
            item.id,
            item.idTipoComprobante,
            item.serie,
            item.numero,
            item.idSede,
            this.auth.getUser().id
          ).toPromise().then(  (e: ComprobanteElectronicoValidar | ErrorSistema) => {

            if(e instanceof ErrorSistema){
              console.log('error');
              // this.collection.find(x => x.idTipoComprobante === item.idTipoComprobante && x.serie === item.serie && parseInt(x.numero,10) === parseInt(item.numero, 10) ).estadoSunat = 'error';
            }else{
              const comprobante = this.collection.find(x => x.idTipoComprobante === item.idTipoComprobante && x.serie === item.serie && parseInt(x.numero,10) === parseInt(item.numero, 10) );
              if(comprobante){
                comprobante.idEstadoSunat = item.idEstadoSunat;
                comprobante.estadoSunat = item.estadoSunat;
                comprobante.estadoSunatColor = item.estadoSunatColor;
              }
              // this.collection.find(x => x.id === item.id).estadoSunat = e.sunat;
            }
            item.validando = false;
            this.dataTable.clear().rows.add(this.collection).draw();

          }).catch(e => {
            item.validando = false;
            // this.collection.find(x => x.id === item.id).estadoSunat = '400';
            this.dataTable.clear().rows.add(this.collection).draw();
          });
        }

        if ( i === (this.collection.length - 1) ) {
          console.log('finish');
          // await resolve(collection);
          // this.submittedSiguienteCita = false;
          this.ldValidando = false;
          await resolve();
        }


      }
    });
  }

  /**************************************************************************************
   * Functions
   */
  getTicketEstructura(datosEmpresa): any {
    const lineaSeparacion = '------------------------------------------------------------------------------------------';
    const estructura: any = {
      content: [
        [
          this.getProfilePicObject()
        ],
        { text: datosEmpresa.razonSocial,       bold: true,   fontSize: 10,     margin: [0, 5, 0, 0],   alignment: 'center',    style: 'name'      },
        { text: 'R.U.C. ' + datosEmpresa.ruc,   bold: true,   fontSize: 10,     margin: [0, 2, 0, 0],   alignment: 'center',    style: 'name'      },
        { text: datosEmpresa.descripcion,       bold: false,  fontSize: 8,      margin: [0, 2, 0, 0],   alignment: 'center',    style: 'name'      },
        { text: datosEmpresa.direccionBySede,   bold: false,  fontSize: 8,      margin: [0, 2, 0, 0],   alignment: 'center',    style: 'name'      },
        { text: datosEmpresa.telefonos,         bold: false,  fontSize: 8,      margin: [0, 2, 0, 0],   alignment: 'center',    style: 'name'      },
        { text: 'TICKET DE VENTA',                          bold: true,  fontSize: 8,      margin: [0, 2, 0, 0],   alignment: 'center',    style: 'name',  decoration: 'underline' },
        { text: datosEmpresa.serieNumeroComprobante,           bold: false,  fontSize: 8,      margin: [0, 2, 0, 0],   alignment: 'center',    style: 'name'      },
        { text: lineaSeparacion,                            bold: false,  fontSize: 8,      margin: [0, 2, 0, 0],   alignment: 'center',    style: 'name'      },
        {
          widths: [100, 50],
          columns :
            [
              { text: 'Fecha emisión:',      fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],   alignment: 'left' },
              { text: this.utilsService.formato_FechaFullString(new Date(), '-', ':'),  fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],     alignment: 'right' },
            ]
        },
        {
          widths: [100, 50],
          columns :
            [
              { text: 'Sede:',       fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],     alignment: 'left' },
              { text: datosEmpresa.sede, fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],     alignment: 'right' },
            ]
        },
        { columns :
            [
              { text: 'Emitido por:',      fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],   alignment: 'left' },
              { text: this.usuarioActual.login,       fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],     alignment: 'right' },
            ]
        },
        { columns :
            [
              { text: 'Documento:',  fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],      alignment: 'left' },
              { text: datosEmpresa.documento,    fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],      alignment: 'right' },
            ]
        },
        { columns :
            [
              { text: 'Cliente:',  fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],      alignment: 'left' },
              { text: datosEmpresa.cliente,    fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],      alignment: 'right' },
            ]
        },
        { text: lineaSeparacion, bold: false,  fontSize: 8, margin: [0, 2, 0, 0],   alignment: 'center',    style: 'name'      },
        {
          style: 'tableExample',
          table: {
            headerRows: 1,
            widths: [60, 10, 50, 55],
            body: [
              [
                {text: 'DESCRIPCIÓN', style: 'tableHeader', alignment: 'left'},
                {text: 'SS',          style: 'tableHeader', alignment: 'right'},
                {text: 'P.U.',        style: 'tableHeader', alignment: 'right'},
                {text: 'IMPORTE',     style: 'tableHeader', alignment: 'right'}
              ],
              // Mostrar las zonas dinamicamente
            ]
          },
          layout: 'noBorders',
        },
        { text: lineaSeparacion, bold: false,  fontSize: 8,      margin: [0, 2, 0, 0],   alignment: 'center',    style: 'name'      },
        {
          columns:
            [
              { text: 'SubTotal:',   fontSize: 8,  bold: false,  margin: [0, 2, 0, 0], alignment: 'left'  },
              { text: 'S/',  fontSize: 8,  bold: false,  margin: [0, 2, 0, 0], alignment: 'right' },
              { text: datosEmpresa.total.toFixed(2).toString(), fontSize: 8,  bold: false,  margin: [0, 2, 0, 0], alignment: 'right' }
            ]
        },
        {
          columns:
            [
              { text: 'Adelantos:', fontSize: 8,  bold: false,  margin: [0, 2, 0, 0], alignment: 'left'  },
              { text: 'S/',  fontSize: 8,  bold: false,  margin: [0, 2, 0, 0], alignment: 'right' },
              { text: '0.00',    fontSize: 8,  bold: false,  margin: [0, 2, 0, 0], alignment: 'right' }
            ]
        },
        {
          columns:
            [
              { text: 'Concepto Total:',  fontSize: 8,  bold: false, margin: [0, 2, 0, 0],  alignment: 'left'  },
              { text: 'S/',  fontSize: 8,  bold: false,  margin: [0, 2, 0, 0], alignment: 'right' },
              { text: datosEmpresa.total.toFixed(2).toString(), fontSize: 8,  bold: false, margin: [0, 2, 0, 0],  alignment: 'right' }
            ]
        },
        {
          columns:
            [
              { text: 'Saldo Deudor:',  fontSize: 8,  bold: false,  margin: [0, 2, 0, 0],  alignment: 'left' },
              { text: 'S/',  fontSize: 8,  bold: false,  margin: [0, 2, 0, 0], alignment: 'right' },
              { text: '0.00',        fontSize: 8,  bold: false,  margin: [0, 2, 0, 0], alignment: 'right'}
            ]
        },
        {
          columns: [
            { text: 'Vuelto:',  fontSize: 8,  bold: false,  margin: [0, 2, 0, 0],   alignment: 'left'  },
            { text: 'S/',  fontSize: 8,  bold: false,  margin: [0, 2, 0, 0], alignment: 'right' },
            { text: datosEmpresa.vuelto.toFixed(2),  fontSize: 8,  bold: false,  margin: [0, 2, 0, 0],   alignment: 'right' }
          ]
        },
        {
          columns:
            [
              { text: 'SON: ' + this.numeroALetras.NumeroALetras(datosEmpresa.total) , fontSize: 8,  bold: false,  margin: [0, 2, 0, 0],alignment: 'left' }
            ]
        },
        {
          columns:
            [
              { text: 'Modalidad: Efectivo',  fontSize: 8, bold: false, margin: [0, 2, 0, 0], alignment: 'left' }
            ]
        },
        {
          columns:
            [
              { text: 'Representación impresa de comprobante', fontSize: 5, bold: false, margin: [0, 2, 0, 0], alignment: 'center' }
            ]
        }
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
        // alignment: 'justify'
      },
      pageMargins: [5,5,5,0],
      pageSize: { height: 595,  width: 210  }
    }

    for(var i = 0; i < datosEmpresa.detalle.length; i++){
      const zona = datosEmpresa.detalle[i].zonaCorporal;
      const sesion = datosEmpresa.detalle[i].sesion;
      const precio = datosEmpresa.detalle[i].precio;
      const importe = precio;
      estructura.content[15].table.body.push(
        [ { text: zona, style: 'tableBody' }, {text: sesion, alignment: 'right', style: 'tableBody'}, {text: precio.toFixed(2).toString(),  alignment: 'right', style: 'tableBody'}, {text: importe.toFixed(2).toString(), alignment:  'right', style: 'tableBody'}]
      );
    }
    return estructura;
  }
  getProfilePicObject() {
    return {
      image:"data:image/png;base64,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",
      width: 100,
      /* alignment : 'center' */
      margin: [50,0,0,0],
      alignment : 'left'
    };
  }

}
