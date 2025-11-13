import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Input,} from '@angular/core';
import {Subject, Subscription, BehaviorSubject} from "rxjs";
import {DataTableDirective} from "angular-datatables";
import {DatePipe} from "@angular/common";
import Api = DataTables.Api;
import {UtilsService} from "../../../../shared/services/funciones/utils.service";
import {AuthService} from "../../../../shared/services/auth.service";
import {ErrorSistema} from "../../../../shared/models/error-sistema";
import {ComprobanteSerie} from "../../../../shared/models/facturacion/comprobante-serie";
import {ComprobanteElectronicoAnuladoService} from "../../../../shared/services/facturacion/comprobante-electronico-anulado.service";
import { ComprobanteAnulacion } from '../../../../shared/models/facturacion/comprobante-anulaciones';
import {
  ComprobanteElectronico,
  ComprobanteElectronicoValidar
} from "../../../../shared/models/facturacion/comprobante-electronico";
import {MdlPdfGoogleViewComponent} from "../../../modals/mdl-pdf-google-view/mdl-pdf-google-view.component";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {ComprobanteElectronicoService} from "../../../../shared/services/facturacion/comprobante-electronico.service";

@Component({
  selector: 'tbl-comprobante-anulaciones',
  templateUrl: './tbl-comprobante-anulaciones.component.html',
  styleUrls: ['./tbl-comprobante-anulaciones.component.scss']
})
export class TblComprobanteAnulacionesComponent implements OnInit, OnDestroy, AfterViewInit {


  @Input() FechaDesde: string;
  @Input() FechaHasta: string;
  @Input() IdSede: number = 0;
  @Input() IdTipoComprobante: number = 0;

  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;

  loading = false;
  optionDataTable: any = {};
  subscription: Subscription;
  datatableContratos: Api;
  selected = new Subject<ComprobanteSerie | null>();
  dataTable: any;


  modalComprobanteRef: NgbModalRef | undefined;
  sbcVerPdf: Subscription | undefined;

  ldValidando: boolean;
  _ldValidando = new BehaviorSubject<boolean>(false);
  collection: ComprobanteAnulacion[] = [];

  constructor(
    private api: ComprobanteElectronicoAnuladoService,
    private utilService: UtilsService,
    private datePipe: DatePipe,
    private auth: AuthService,
    private modalService: NgbModal,
    private comprobanteService: ComprobanteElectronicoService
  ) {
    this.ldValidando = false;
  }

  ngOnInit(): void {
    this.initValues();
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      this.dataTable = dtInstance;

      dtInstance.on('deselect',  (e, dt, type, indexes ) => {
        this.selected.next(null);
      });

      dtInstance.on('select',  (e, dt, type, indexes ) => {
        if ( type === 'row' ) {
          this.selected.next( dtInstance.rows('.selected').data()[0] );
        }
      });

    });



  }

  initValues(): void{
    this.optionDataTable = {
      //mark: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.loading = true;

        console.log(this.IdTipoComprobante, this.IdSede);

        this.subscription = this.api.collection( this.FechaDesde, this.FechaHasta, this.IdTipoComprobante, this.IdSede, this.auth.getUser().id).subscribe((data: ComprobanteAnulacion[] | ErrorSistema) => {

          if( data instanceof  ErrorSistema){
            this.utilService.mostrarToast(data.message,'error');
            callback([]);
            this.collection = [];
          }else{
            callback({ data : data });
            this.collection = data;
          }

        }, err =>{
          console.log('Error al obtener las solicitudes de anulación', err);
          callback([]);
          this.collection = [];
          this.utilService.mostrarToast('Error al obtener las solicitudes de anulación','warning');
        }, () => {
          this.loading = false;
        });

      },
      dom: "<'row mx-0'<'col-sm-6'l><'col-sm-6'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row mx-0'<'col-sm-5 py-2'i><'col-sm-7 py-2'p>>",
      serverSide: false,
      processing: true,
      pageLength: 10,
      async: true,
      "lengthMenu": [[5,10, 25, 50, -1], [5,10, 25, 50, "Todo"]],
      language: this.utilService.datatableIdioma,
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
        { title: 'Código', data: 'codigo'},
        { title: 'TipoComprobante', data: 'tipoComprobante'},
        { title: 'C. Mod', data: 'serie', render: (data, xhr, row) => {
            return `<a id="btnVerPdfComprobante" class="bg-light px-2 rounded fw-bold"><i class="fa-light fa-file-pdf"></i> ${data}-${row.numero.toString().padStart(8,'0')}</a>`;
        }},
        // { title: 'Serie', data: 'serie', class: 'fw-bold'},
        // { title: 'Número', data: 'numero', class: 'fw-bold'},
        { title: 'Motivo', data: 'motivo', width: '400px'},
        { title: 'Sede', data: 'sede'},
        { title: 'E. SUNAT', data: null, render: (data, xhr, row) => {
            return `<span class="rounded text-uppercase text-white px-2 fw-bold" style="background-color: ${row.estadoSunatColor}">${row.estadoSunat}</span> ${ row.validando ? '<i class="fa-regular fa-loader fa-spin"></i>' : '' }`;
          }},
        { title: 'F. Registro', data: 'fechaRegistro', render: (data) => {
            return this.datePipe.transform(data,'dd-MM-yyyy');
          }, width: '90px'},
        { title: 'H. Registro', data: 'fechaRegistro', render: (data) => {
            return this.datePipe.transform(data,'hh:mm:ss');
          }, width: '90px'},
        { title: 'U. Registro', data: 'usuarioRegistro',width: '150'},
        { title: 'F. Modifico', data: 'fechaModifico', render: (data) => {
            return this.datePipe.transform(data,'dd-MM-yyyy');
          }, width: '90px'},
        { title: 'H. Modifico', data: 'fechaModifico', render: (data) => {
            return this.datePipe.transform(data,'hh:mm:ss');
          }, width: '90px'},
        { title: 'U. Modifico', data: 'usuarioModifico',width: '150'},
      ],
      "fnRowCallback": (nRow, aData: ComprobanteElectronico, iDisplayIndex) => {
        nRow.querySelector('#btnVerPdfComprobante').addEventListener('click', () => {

          this.sbcVerPdf = this.comprobanteService.verPdf( this.auth.getUser().id!, 0, aData.idTipoComprobante, aData.serie, aData.numero).subscribe(
            async (resultado: string | ErrorSistema) => {

              if(resultado instanceof  ErrorSistema){
                this.utilService.mostrarToast(resultado.message, 'error');
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
      }
    }
  }

  reload( reset: boolean = true ): void{
    console.log('reload');
    this.dataTable.ajax.reload(null,reset);
  }

  async evtValidar(): Promise<void>{
    await this.collection.forEach(x => {
      x.validando = true;
    });
    await this.dataTable.clear().rows.add(this.collection).draw();

    await this.validarAnulaciones();

  }

  async validarAnulaciones(): Promise<void> {

    return new Promise(async (resolve, reject) => {

      // const collection: PhonesNum[] = [];
      this.ldValidando = true;
      this._ldValidando.next(true);
      for (const [i, item] of this.collection.entries()) {

        if( item.validando === true ){
          await this.api.consultarAnulacion(
            item.idTipoComprobante,
            item.serie,
            item.numero.toString(),
            item.idSede,
            this.auth.getUser().id
          ).toPromise().then(  (e: ComprobanteAnulacion | ErrorSistema) => {

            if(e instanceof ErrorSistema){
              console.log('error');
              // this.collection.find(x => x.idTipoComprobante === item.idTipoComprobante && x.serie === item.serie && parseInt(x.numero,10) === parseInt(item.numero, 10) ).estadoSunat = 'error';
            }else{
              const comprobante = this.collection.find(x => x.idTipoComprobante === e.idTipoComprobante && x.serie === e.serie && parseInt(x.numero.toString(),10) === parseInt(e.numero.toString(), 10) && x.codigo === e.codigo );
              if(comprobante){
                console.log(comprobante, e);
                comprobante.idEstadoSunat = e.idEstadoSunat;
                comprobante.estadoSunat = e.estadoSunat;
                comprobante.estadoSunatColor = e.estadoSunatColor;
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
          this._ldValidando.next(false);
          await resolve();
        }

      }
    });
  }

}
