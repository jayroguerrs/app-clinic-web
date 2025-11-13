import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { DatePipe } from '@angular/common';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { CajaService } from '../../../shared/services/caja.service';
import { Usuario } from '../../../shared/models';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilsService } from '../../../shared/services/funciones/utils.service';
import { GlobalConstants } from 'src/commons/global-constants';
import {CuadreCaja} from "../../../shared/models/caja";
import {MdlPdfGoogleViewComponent} from "../../modals/mdl-pdf-google-view/mdl-pdf-google-view.component";
import {EnumTipoPago} from "../../../shared/enumeracion/enums";

@Component({
  selector: 'app-caja-cuadre',
  templateUrl: './caja-cuadre.component.html',
  styleUrls: ['./caja-cuadre.component.scss'],
  providers: [DatePipe]
})
export class CajaCuadreComponent implements OnInit, OnDestroy {
  @Input() idCaja: number = 0;
  @Input() sede: string = '';
  @Input() caja: string = '';
  @Input() Caja: any = null;
  @Input() modal: NgbModalRef;

  rutaImageSpinner = GlobalConstants.gIconoSpinner;
  frmCajaCuadre: FormGroup;
  datosCuadre: any = [];
  usuarioActual: Usuario;
  options = { prefix: 'S/ ', thousands: '', decimal: '.', inputMode: CurrencyMaskInputMode.NATURAL }


  cajaCuadre: CuadreCaja | undefined;

  modalComprobanteViewRef: NgbModalRef | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private cajaService: CajaService,
    private usuarioService: UsuarioService,
    private spinner: NgxSpinnerService,
    private utilsService: UtilsService,

    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.usuarioActual = this.usuarioService.UsuarioActual;
    this.inicializarFormulario();
    this.consultarTotales();
  }

  ngOnDestroy(): void {

    this.modalComprobanteViewRef?.close();
  }

  inicializarFormulario(): void {
    this.frmCajaCuadre = this.formBuilder.group({
        fechaCuadre: [new Date()],
        sedeCuadre: [this.sede],
        cajaCuadre: [this.caja],
        totalIngreso: [0.00],
        totalSaldoInicial: [0.00],
        totalGastoDia: [0.00],
        total: [0.00],
        usuario: [this.usuarioActual.nombre]
    });

    const date = new Date();
    this.frmCajaCuadre.patchValue({
      fechaCuadre:  this.datePipe.transform(date, 'yyyy-MM-dd'),
    });
  }
  consultarTotales(): void {
    this.spinner.show();
    this.cajaService.obtenerCuadreCaja(this.frmCajaCuadre.controls.fechaCuadre.value, this.idCaja, this.usuarioService.UsuarioActual.idUsuario).subscribe(
      resultado => {

        this.cajaCuadre = resultado;
        this.datosCuadre = resultado;

        console.log(resultado);

        this.verCuadre(resultado, this.Caja);
        /*this.frmCajaCuadre.patchValue({
          totalIngreso: this.datosCuadre.ingreso,
          totalGastoDia: this.datosCuadre.egreso,
          totalSaldoInicial: this.datosCuadre.saldoInicial,
          total: this.datosCuadre.total,
        });*/
        this.spinner.hide();
      },
      error => {
        console.log('Error al obtener el cuadre de caja', error);
        this.spinner.hide();
      }
    );
  }
  cerrarModal(): void {
    this.modal.close();
  }
  imprimirCuadre(): void {
    // const documentDefinition = this.getTicketEstructura();
    // pdfMake.createPdf(documentDefinition).print();
  }


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
  // getTicketEstructura(): any {
  //   const lineaSeparacion = '------------------------------------------------------------------------------------------';
  //   const dd: any = {
  //     content: [
  //       { text: 'CUADRE DE CAJA',       bold: true,   fontSize: 10,     margin: [0, 5, 0, 0],   alignment: 'center',    style: 'name'      },
  //       { text: lineaSeparacion,                            bold: false,  fontSize: 8,      margin: [0, 2, 0, 0],   alignment: 'center',    style: 'name'      },
  //       {
  //         widths: [100, 50],
  //         columns :
  //         [
  //               { text: 'FECHA:',      fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],   alignment: 'left' },
  //               { text: this.frmCajaCuadre.controls.fechaCuadre.value,  fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],     alignment: 'right' },
  //         ]
  //       },
  //       {
  //         widths: [100, 50],
  //         columns :
  //         [
  //               { text: 'SEDE:',       fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],     alignment: 'left' },
  //               { text: this.sede, fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],     alignment: 'right' },
  //         ]
  //       },
  //       { text: lineaSeparacion,                            bold: false,  fontSize: 8,      margin: [0, 2, 0, 0],   alignment: 'center',    style: 'name'      },
  //       { text: 'RESUMEN DEL DIA',       bold: true,   fontSize: 10,     margin: [0, 5, 0, 0],   alignment: 'center',    style: 'name'      },
  //       { text: lineaSeparacion,                            bold: false,  fontSize: 8,      margin: [0, 2, 0, 0],   alignment: 'center',    style: 'name'      },
  //       { columns :
  //         [
  //               { text: 'INGRESO VENTA:',      fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],   alignment: 'left' },
  //               { text: 'S/',  fontSize: 8,  bold: false,  margin: [0, 2, 0, 0], alignment: 'right' },
  //               { text: this.datosCuadre.ingreso.toFixed(2).toString(),       fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],     alignment: 'right' },
  //         ]
  //       },
  //       { columns :
  //         [
  //               { text: 'SALDO INICIAL:',  fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],      alignment: 'left' },
  //               { text: 'S/',  fontSize: 8,  bold: false,  margin: [0, 2, 0, 0], alignment: 'right' },
  //               { text: this.datosCuadre.saldoInicial.toFixed(2).toString(),    fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],      alignment: 'right' },
  //         ]
  //       },
  //       { columns :
  //         [
  //               { text: 'GASTO DEL DIA:',  fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],      alignment: 'left' },
  //               { text: 'S/',  fontSize: 8,  bold: false,  margin: [0, 2, 0, 0], alignment: 'right' },
  //               { text: this.datosCuadre.egreso.toFixed(2).toString(),    fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],      alignment: 'right' },
  //         ]
  //       },
  //       { text: lineaSeparacion, bold: false,  fontSize: 8, margin: [0, 2, 0, 0],   alignment: 'center',    style: 'name'      },
  //       { columns :
  //         [
  //               { text: 'TOTAL EFECTIVO:',  fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],      alignment: 'left' },
  //               { text: 'S/',  fontSize: 8,  bold: false,  margin: [0, 2, 0, 0], alignment: 'right' },
  //               { text: this.datosCuadre.total.toFixed(2).toString(),    fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],      alignment: 'right' },
  //         ]
  //       },
  //       { text: lineaSeparacion, bold: false,  fontSize: 8, margin: [0, 2, 0, 0],   alignment: 'center',    style: 'name'      },
  //       { columns :
  //         [
  //               { text: 'USUARIO:',  fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],      alignment: 'left' },
  //               { text: this.usuarioActual.nombre,    fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],      alignment: 'right' },
  //         ]
  //       },
  //       { columns :
  //         [
  //               { text: 'FECHA IMPRESIÓN:',  fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],      alignment: 'left' },
  //               { text: this.utilsService.formato_FechaFullString(new Date(), '-', ':'),    fontSize: 8,  bold: true,   margin: [0, 2, 0, 0],      alignment: 'right' },
  //         ]
  //       }
  //     ],
  //     styles: {
  //       header: {
  //         fontSize: 8,
  //         bold: true,
  //         margin: [0, 0, 0, 10]
  //       },
  //       subheader: {
  //         fontSize: 8,
  //         bold: true,
  //         margin: [0, 10, 0, 5]
  //       },
  //       tableExample: {
  //         margin: [0, 0, 0, 0]
  //       },
  //       tableHeader: {
  //         bold: true,
  //         fontSize: 8,
  //         color: 'black',
  //         margin: [0, 0, 0, 0]
  //       },
  //       tableBody: {
  //         fontSize: 8,
  //         color: 'black',
  //         margin: [0, 0, 0, 0]
  //       },
  //       name: {
  //         fontSize: 8,
  //         bold: true,
  //         alignment: 'center',
  //         margin: [0, 20, 0, 10],
  //       }
  //     },
  //     defaultStyle: {
  //     },
  //     pageMargins: [5,5,5,0],
  //     pageSize: { height: 300,  width: 210  }
  //   }
  //   return dd;
  // }



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
          { text: (x.fechaHoraCierre ? this.datePipe.transform(new Date(x.fechaHoraCierre)) : 'No hay cierre' ), bold: false, fontSize: 8, alignment: 'right', border:[false,false,false,false], margin: [0,0,0,0]},
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
          [
            {
              text: 'TOTAL EFECTIVO',
              bold: true,
              fontSize: 10,
              alignment: 'left',
              border: [false, false, false, false],
              margin: [0, 0, 0, 0]
            },
            {
              text: `S/ ${totalEfectivo.toFixed(2)}`,
              bold: true,
              fontSize: 10,
              alignment: 'right',
              border: [false, false, false, false],
              margin: [0, 0, 0, 0]
            },
          ]
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
