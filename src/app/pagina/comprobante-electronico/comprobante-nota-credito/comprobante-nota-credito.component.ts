import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FlatpickrOptions} from "ng2-flatpickr";
import Spain from "flatpickr/dist/l10n/es";
import {DatePipe} from "@angular/common";
import {DataTableDirective} from "angular-datatables";
import {Subscription} from "rxjs";
import {UtilsService} from "../../../shared/services/funciones/utils.service";
import { AuthService } from 'src/app/shared/services/auth.service';
import {NgbModalRef, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MdlEmisionNotaCreditoComponent} from "../../../componentes/modals/facturacion/mdl-emision-nota-credito/mdl-emision-nota-credito.component";
import {ComprobanteElectronicoService} from "../../../shared/services/facturacion/comprobante-electronico.service";
import { ErrorSistema } from 'src/app/shared/models/error-sistema';
import {
  ComprobanteElectronico,ComprobanteElectronicoValidar
} from 'src/app/shared/models/facturacion/comprobante-electronico';
import {EnumTipoComprobante} from "../../../shared/enumeracion/enums";
import {MdlPdfGoogleViewComponent} from "../../../componentes/modals/mdl-pdf-google-view/mdl-pdf-google-view.component";
import {TipoComprobante} from "../../../shared/models/tipo-comprobante";
import {Sede} from "../../../shared/models/sede";
import {TipoComprobanteService} from "../../../shared/services/tipo-comprobante.service";
import {SedeService} from "../../../corporal360/shared/service/sede.service";

@Component({
  selector: 'app-comprobante-nota-credito',
  templateUrl: './comprobante-nota-credito.component.html',
  styleUrls: ['./comprobante-nota-credito.component.scss']
})
export class ComprobanteNotaCreditoComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;

  formGroup: FormGroup;
  flatOptions: FlatpickrOptions = {
    locale: Spain.es,
    // mode: 'single',
    altFormat: 'd F Y',
    dateFormat: 'Y-m-d',
    allowInput: false,
    altInput: true,
    altInputClass: 'form-control form-indigo form-control-sm text-center',
    defaultDate: new Date()
  };

  flatOptions2: FlatpickrOptions = {
    locale: Spain.es,
    // mode: 'single',
    altFormat: 'd F Y',
    dateFormat: 'Y-m-d',
    allowInput: false,
    altInput: true,
    altInputClass: 'form-control form-indigo form-control-sm text-center border-right-0',
    defaultDate: new Date()
  };

  fechaDesde: Date;
  fechaHasta: Date;

  loading: boolean;

  dtResponsiveOptions: any = {};
  dataTable: any;

  selected: ComprobanteElectronico | undefined;
  submitted: boolean;
  subscription: Subscription | undefined;

  collection: ComprobanteElectronico[] = [];


  modalComprobanteRef: NgbModalRef | undefined;


  sbcVerPdf: Subscription | undefined;

  ldValidando: boolean;


  /************ tipos de collection **************/
  ldTiposComprobante: boolean;
  sbcTiposComprobante: Subscription | undefined;
  tiposComprobante: TipoComprobante[] = [];


  /************ sedes **************/
  ldSedes: boolean;
  sbcSedes: Subscription | undefined;
  sedes: Sede[] = [];

  idSede: number = 0;
  idTipoComprobante: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private utilsService: UtilsService,
    private auth: AuthService,
    private api: ComprobanteElectronicoService,
    private modalService: NgbModal,
    private tipoComprobanteService: TipoComprobanteService,
    private sedeService: SedeService,
  ) {
    this.ldTiposComprobante = false;
    this.ldSedes = false;
    this.ldValidando = false;
    this.formGroup = this.formBuilder.group({
      fechaDesde: new FormControl(null, Validators.required),
      fechaHasta: new FormControl(null, Validators.required),
      idTipoComprobante: new FormControl(0, Validators.required),
      idSede: new FormControl(0, Validators.required),
    });
    this.formGroup.get('fechaDesde').valueChanges.subscribe((res) => {
      this.fechaDesde = res[0]
    });
    this.formGroup.get('fechaHasta').valueChanges.subscribe((res) => {
      this.fechaHasta = res[0]
    });
    this.formGroup.get('idSede').valueChanges.subscribe((res) => {
      if(res){
        console.log(res);
        this.idSede = parseInt(res, 10);
      }
    });
    this.formGroup.get('idTipoComprobante').valueChanges.subscribe((res) => {
      if(res){
        console.log(res);
        this.idTipoComprobante = parseInt(res, 10);
      }
    });

    this.formGroup.patchValue({
      fechaDesde: [new Date()],
      fechaHasta: [new Date()],
      idTipoComprobante: 0,
      idSede: 0
    })

    this.loading = false;
    this.submitted = false;
  }

  ngOnInit(): void {
    this.submitted = true;
    this.render();
  }

  ngOnDestroy(): void {
    this.modalComprobanteRef?.close();
    this.sbcVerPdf?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.obtenerTiposComprobante();
    this.obtenerSedes();


    this.datatableElement.dtInstance.then((dtInstance: any) => {

      this.dataTable = dtInstance;

      dtInstance.on('select',  (e, dt, type, indexes ) => {
        if ( type === 'row' ) {
          this.selected = dtInstance.rows('.selected').data()[0];
        }
      });

      dtInstance.on('deselect', (e, dt, type, indexes ) => {
        this.selected = null ;
      });

    });
  }

  onReload(): void{
    this.evtOnSubmit();
  }

  onCreate(): void{
    this.modalComprobanteRef = this.modalService.open(MdlEmisionNotaCreditoComponent, {
      // size: 'xl mw-100 mx-md-4',
      size: 'lg w-100 max-w-1200px',
      backdrop: "static",
      windowClass: 'smodal fade round popins bg-dark-30',
      keyboard: false,
      backdropClass: 'bg-transparent',
      animation: true,
      scrollable: false
    });
    this.modalComprobanteRef.componentInstance.OnCreated.subscribe((res) => {
      this.modalComprobanteRef.close();
      if(this.formGroup.valid){
        this.onReload();
      }
    });
  }

  onExport(): void{
    this.dataTable?.buttons[0].trigger();
  }

  onEdit(): void{
  }

  /**********************************************************************
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

          const fechaDesde = this.datePipe.transform(this.fechaDesde, 'yyyy-MM-dd');
          const fechaHasta = this.datePipe.transform(this.fechaHasta, 'yyyy-MM-dd');
          // const idSede = parseInt(this.f.idSede.value, 10);
          // const idTipoComprobante = parseInt(this.f.idTipoComprobante.value, 10);

          this.subscription?.unsubscribe();
          this.loading = true;
          this.subscription = this.api.obtenerNotasCredito( fechaDesde, fechaHasta, this.idTipoComprobante, this.idSede).subscribe( (res: ComprobanteElectronico[] | ErrorSistema) => {
            if(res instanceof ErrorSistema){
              this.collection = [];
              callback({ data : [] });
              // console.log(res);
              this.utilsService.mostrarToast(res.message,'error');
            }else{
              callback({
                data : res
              });
              this.collection = res;
              console.log(res);
            }
            this.loading = false;
          }, err =>  {
            callback({ data : [] });
            this.collection = [];
            this.loading = false;
            console.log('Error al obtener las notas de crédito ', err);
            this.utilsService.mostrarToast('Error al obtener las notas de crédito','error');
          });
          callback({ data : [] });
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
        {title: '', data: null, orderable: false, className: "w-38px max-w-38px border-box", render: (data) => {
          return '<button id="btnVerXml" class="btn btn-sm btn-icon rounded p-1 btn-success m-0 w-auto h-auto fs-16px w-28px" title="XML"><i class="fa-light fa-file-code"></i></button>';
        }},
        {title: '', data: null, orderable: false, className: "w-38px max-w-38px border-box", render: (data) => {
            return '<button id="btnVerPdf" class="btn btn-sm btn-icon rounded p-1 btn-indigo m-0 w-auto h-auto fs-16px w-28px" title="VER"><i class="fa-light fa-eye"></i></button>';
        }},
        { title: 'T. Comprobante', data: 'tipoComprobante'},
        { title: 'Serie', data: 'serie'},
        { title: 'Numero', data: 'numero'},
        { title: 'Observaciones', data: 'observaciones'},
        //{ title: 'Comprobante', data: 'comprobante'},
        { title: 'Tipo', data: 'tipoNotaCredito'},

        { title: 'TC. Mod', data: 'tipoComprobanteModifica'},
        { title: 'C. Mod', data: 'serieComprobanteModifica', render: (data, xhr, row) => {
          return `<a id="btnVerPdfComprobanteModifica" class="bg-light px-2 rounded fw-bold"><i class="fa-light fa-file-pdf"></i> ${data}-${row.numeroComprobanteModifica.padStart(8,'0')}</a>`;
        }},
        // { title: 'N. Mod', data: 'numeroComprobanteModifica', className: 'text-uppercase'},
        // { title: 'F. Registro', data: 'fechaRegistro', render: (data: Date) => {
        //     return this.datePipe.transform(data, 'dd/MM/yyyy');
        // }},
        { title: 'Sede', data: 'sede'},
        // { title: 'Anulado', data: 'sunatAnulado', render: (data: boolean) => {
        //   return data ? 'SI' : 'NO';
        // }},
        { title: 'E. SUNAT', data: null, render: (data, xhr, row) => {
            return `<span class="rounded text-uppercase text-white px-2" style="background-color: ${row.estadoSunatColor}">${row.estadoSunat}</span> ${ row.validando ? '<i class="fa-regular fa-loader fa-spin"></i>' : '' }`;
        }},
        { title: 'F. Emisión', data: 'fechaEmision', render: (data: Date) => {
            return data ? this.datePipe.transform(data, 'dd/MM/yyyy') : null;
          }},
        { title: 'U. Registro', data: 'usuarioRegistro'},
        // { title: 'U. Modifico', data: 'usuarioModifico'},
      ],
      serverSide: false,
      processing: false,
      async: true,
      buttons: [
        {
          extend: 'excelHtml5',
          title: () => {
            return `Reporte de Ventas del ${this.datePipe.transform(this.fechaDesde,'dd/MM/yyyy')} al ${this.datePipe.transform(this.fechaHasta,'dd/MM/yyyy')}`;
          },
          autoFilter: true,
          sheetName: 'Data',
          // exportOptions: {
          //   columns: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]
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
      "fnRowCallback": (nRow, aData: ComprobanteElectronico, iDisplayIndex) => {
        // nRow.setAttribute('id',aData[0]);
        nRow.querySelector('#btnVerPdf').addEventListener('click', () => {

          this.sbcVerPdf = this.api.verPdf( this.auth.getUser().id!, aData.id, aData.idTipoComprobante, aData.serie, aData.numero).subscribe(
            async (resultado: string | ErrorSistema) => {

              if(resultado instanceof  ErrorSistema){
                this.utilsService.mostrarToast(resultado.message, 'error');
                return;
              }

              const pdfstr = await fetch(`data:application/pdf;base64,${resultado}`);
              const blobFromFetch= await pdfstr.blob();
              const blob = new Blob([blobFromFetch], {type: "application/pdf"});
              const blobUrl = URL.createObjectURL(blob);

              this.modalComprobanteRef = this.modalService.open(MdlPdfGoogleViewComponent, {
                // size: 'xl mw-100 mx-md-4',
                size: 'lg w-100 max-w-600px',
                backdrop: "static",
                windowClass: 'smodal fade round popins bg-dark-30',
                keyboard: false,
                backdropClass: 'bg-transparent',
                animation: true,
                scrollable: true
              });
              this.modalComprobanteRef.componentInstance.Url = blobUrl;

            },
            error => console.log('Error al obtener el pdf del comprobante', error));

        }, false);

        nRow.querySelector('#btnVerPdfComprobanteModifica').addEventListener('click', () => {

          this.sbcVerPdf = this.api.verPdf( this.auth.getUser().id!, aData.idVenta, aData.idTipoComprobanteModifica, aData.serie, parseInt(aData.numeroComprobanteModifica, 10)).subscribe(
            async (resultado: string | ErrorSistema) => {

              if(resultado instanceof  ErrorSistema){
                this.utilsService.mostrarToast(resultado.message, 'error');
                return;
              }

              const pdfstr = await fetch(`data:application/pdf;base64,${resultado}`);
              const blobFromFetch= await pdfstr.blob();
              const blob = new Blob([blobFromFetch], {type: "application/pdf"});
              const blobUrl = URL.createObjectURL(blob);

              this.modalComprobanteRef = this.modalService.open(MdlPdfGoogleViewComponent, {
                // size: 'xl mw-100 mx-md-4',
                size: 'lg w-100 max-w-600px',
                backdrop: "static",
                windowClass: 'smodal fade round popins bg-dark-30',
                keyboard: false,
                backdropClass: 'bg-transparent',
                animation: true,
                scrollable: true
              });
              this.modalComprobanteRef.componentInstance.Url = blobUrl;

            },
            error => console.log('Error al obtener el pdf del comprobante', error));

        }, false);
      },
    };
  }

  /**************************************************************************************
   * Events
   */
  evtOnSubmit(): void{
      this.submitted = true;
      this.dataTable.ajax.reload();
  }

  async evtValidar(): Promise<void>{
    await this.collection.forEach(x => {
      x.validando = true;
    });
    await this.dataTable.clear().rows.add(this.collection).draw();

    await this.validarComprobantes();

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
            item.numero.toString(),
            item.idSede,
            this.auth.getUser().id
          ).toPromise().then(  (e: ComprobanteElectronicoValidar | ErrorSistema) => {

            if(e instanceof ErrorSistema){
              console.log('error');
              // this.collection.find(x => x.idTipoComprobante === item.idTipoComprobante && x.serie === item.serie && parseInt(x.numero,10) === parseInt(item.numero, 10) ).estadoSunat = 'error';
            }else{
              const comprobante = this.collection.find(x => x.idTipoComprobante === item.idTipoComprobante && x.serie === item.serie && x.numero === item.numero );
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

}
