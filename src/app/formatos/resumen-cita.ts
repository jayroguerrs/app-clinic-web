import {DatePipe} from "@angular/common";
import {CitaDetalle} from "../shared/models/cita";
import { ServiciosList } from "../shared/enumeracion/enums";

export const plantilla = (data: Data, datePipe: DatePipe, aplyCuppon? ) => {
  let layoutCupon = [];
  const nombreServicio = ServiciosList.find(s => s.id === data.servicio)?.nombre || '';


  if (aplyCuppon === null) {
    layoutCupon = [
      {
        text: '¡Gracias por su visita!',
        fontSize: 9,
        alignment: 'center',
        margin: [0, 20, 0, 0],
        bold: true
      },
      {
        text: 'Pronto te traeremos nuevas promociones y descuentos.',
        fontSize: 8,
        alignment: 'center',
        margin: [0, 10, 0, 10]
      },
      {
        image: data.valeCupon.barcodeBase64,
        width: 150,
        alignment: 'center',
        margin: [0, 0, 0, 10]
      },
    ]
  } else if (aplyCuppon > 0) {
    layoutCupon = [
      { text: '\n', pageBreak: 'after' }, // Aquí se agrega un salto de página
      {
        text: 'CUPÓN DE DESCUENTO\n',
        bold: true,
        fontSize: 10,
        alignment: 'center',
        decoration: 'underline'
      },
      {
        text: '¡Gracias por su visita!\nUse este cupón en su próxima compra.',
        fontSize: 8,
        alignment: 'center',
        margin: [0, 10, 0, 10]
      },
      {
        text: `Cupón de Regalo por S/.: ${data.valeCupon.descuento}.00`,
        fontSize: 8,
        alignment: 'center',
        bold: true,
        margin: [0, 10, 0, 10]
      },
      {
        image: data.valeCupon.barcodeBase64,
        width: 150,
        alignment: 'center',
        margin: [0, 10, 0, 10]
      },
      {
        text: `Válido hasta el: ${data.valeCupon.fecha_termino}`,
        fontSize: 8,
        alignment: 'center',
        italic: true,
        margin: [0, 10, 0, 10]
      },
      {
        ul: data.valeCupon.notas.map(x => x.texto),
        fontSize: 7
      },
    ];
  }  
   

  const lineaSeparacion = '------------------------------------------------------------------------------------------';

  const renderDetalles = () => {
    const collection = [];
    collection.push(
      [
        {text: 'DESCRIPCIÓN', fontSize: 7, bold: true, alignment: 'left', border: [false, false, true, true]},
        {text: 'SS',          fontSize: 7, bold: true, alignment: 'center', border: [false, false, true, true]},
        {text: 'P. WEB',     fontSize: 7, bold: true, alignment: 'right', border: [false, false, true, true]},
        {text: 'MONTO',        fontSize: 7, bold: true, alignment: 'center', border: [false, false, false, true]},
      ]
    );
    data.detalle.forEach(x => {
      collection.push([
        {text: x.zona, fontSize: 7,alignment: 'left', border: [false, false, true, false]},
        {text: x.sesion, fontSize: 7,alignment: 'center', border: [false, false, true, false]},
        {text: x.pagoWeb ? 'SI' : 'NO', fontSize: 7,alignment: 'center', border: [false, false, true, false]},
        {text: `${x.precio.toFixed(2)}`, fontSize: 7,alignment: 'right', border: [false, false, false, false]},
      ]);
    });

    for (let i = 0; i < 2; i++) {
      collection.push(
        [
          {text: '',  fontSize: 7,  margin: [10, 5, 10, 5],alignment: 'left', border: [false, false, true, false]},
          {text: '',  fontSize: 7,  margin: [10, 5, 10, 5],alignment: 'right', border: [false, false, true, false]},
          {text: '',  fontSize: 7,  margin: [10, 5, 10, 5],alignment: 'center', border: [false, false, true, false]},
          {text: '',  fontSize: 7,  margin: [10, 5, 10, 5],alignment: 'right', border: [false, false, false, false]}
        ]
      );
    }

    collection.push(
      [
        {text: `Total: `, alignment: 'left', colSpan: 2, style: 'tableFooterWithoutBorder', border: [false, true, false, false], bold: true},
        {},
        {text: `S/`, alignment: 'right', style: 'tableFooterWithoutBorder', border: [false, true, false, false], bold: true},
        {text: `${data.detalle.map(x => x.precio).reduce((a,b) => a + b, 0).toFixed(2)}`, alignment: 'right', style: 'tableFooterWithoutBorder', border: [false, true, false, false], bold: true},
      ]
    );

    return collection;
  }

  return {
    
    content: [
      { text: '\n\nRESUMEN CITA\n\n', bold: true, fontSize: 8, margin: [0, 2, 0, 0], alignment: 'center', style: 'name'},
      {
        table: {
          widths: [50,'*'],
          margin: [0,0,0,10],
          body: [
            [
              { text: data.cliente,      fontSize: 10, bold: true,  margin: [0, 10, 0, 10],   alignment: 'center', border: [false,true,false,false], colSpan: 2,  decoration: 'underline' },
              { text:'', border: [false,false,false,false]}
            ],
            [
              { text: `N° Cita:`,      fontSize: 7, bold: true,  margin: [0, 2, 0, 0],   alignment: 'left', border: [false,false,false,false] },
              { text: data.idCita,  fontSize: 7, bold: true,  margin: [0, 5, 0, 0],     alignment: 'right', border: [false,false,false,false] }
            ],
            [
              { text: `Hora Cita:`,      fontSize: 7, bold: true,  margin: [0, 0, 0, 0],   alignment: 'left', border: [false,false,false,false] },
              { text: datePipe.transform(new Date(data.fechaHora),'hh:mm a'),  fontSize: 7, bold: true,  margin: [0, 0, 0, 0],     alignment: 'right', border: [false,false,false,false] }
            ],
            // [
            //   { text: `Cliente:`,      fontSize: 7, bold: true,  margin: [0, 0, 0, 0],   alignment: 'left', border: [false,false,false,false] },
            //   { text: data.cliente,  fontSize: 7, bold: true,  margin: [0, 0, 0, 0],     alignment: 'right', border: [false,false,false,false] }
            // ],
            [
              { text: `Documento:`,      fontSize: 7, bold: true,  margin: [0, 0, 0, 0],   alignment: 'left', border: [false,false,false,false] },
              { text: data.clienteDocumento ? data.clienteDocumento : '',  fontSize: 7, bold: true,  margin: [0, 0, 0, 0],     alignment: 'right', border: [false,false,false,false] }
            ],
            [
              { text: `Cod. Cliente:`,      fontSize: 7, bold: true,  margin: [0, 0, 0, 0],   alignment: 'left', border: [false,false,false,false] },
              { text: data.idCliente,  fontSize: 7, bold: true,  margin: [0, 0, 0, 0],     alignment: 'right', border: [false,false,false,false] }
            ],
            [
              { text: `Nuevo Cliente:`,      fontSize: 7, bold: true,  margin: [0, 0, 0, 0],   alignment: 'left', border: [false,false,false,false] },
              { text: data.nuevoCliente ? 'Si' : 'No',  fontSize: 7, bold: true,  margin: [0, 0, 0, 0],     alignment: 'right', border: [false,false,false,false] }
            ],
            [
              { text: `Fecha emisión:`,      fontSize: 7, bold: true,  margin: [0, 0, 0, 0],   alignment: 'left' , border: [false,false,false,false]},
              { text: datePipe.transform(new Date(),'yyyy-MM-dd hh:mm a'),  fontSize: 7, bold: true,  margin: [0, 0, 0, 0],     alignment: 'right' , border: [false,false,false,false]}
            ],
            [
              { text: `Emitido por:`,      fontSize: 7, bold: true,  margin: [0, 0, 0, 5],   alignment: 'left', border: [false,false,false,false] },
              { text: data.usuario ? data.usuario : '',  fontSize: 7, bold: true,  margin: [0, 0, 0, 5],     alignment: 'right', border: [false,false,false,false] }
            ],
            [
              { text: `Servicio:`,      fontSize: 7, bold: true,  margin: [0, 0, 0, 5],   alignment: 'left', border: [false,false,false,true] },
              { text: nombreServicio,  fontSize: 7, bold: true,  margin: [0, 0, 0, 5],     alignment: 'right', border: [false,false,false,true] }
            ],

          ]
        },
        layout: {
          hLineWidth: function (i, node) {
            return .5;
          },
          hLineColor: function (i, node) {
            return 'black';
          },
          vLineColor: function (i, node) {
            return 'black';
          },
          hLineStyle: function (i, node) {
            return {dash: {length: 3, space: 1}};
          },
          vLineStyle: function (i, node) {
            return null;
          },
          // paddingLeft: function(i, node) { return 4; },
          // paddingRight: function(i, node) { return 4; },
          // paddingTop: function(i, node) { return 2; },
          // paddingBottom: function(i, node) { return 2; },
          // fillColor: function (i, node) { return null; }
        }
      },
      // { text: '\n'},
      {
        table: {
          style: 'tableDescripcion',
          headerRows: 1,
          widths: ['*', 10, 25, 45],
          body: renderDetalles()
        },
        layout: {
          vLineWidth: function (i, node) {
            return .5;
          },
          hLineWidth: function (i, node) {
            return .5;
          },
          vLineColor: function (i, node) {
            return 'black';
          },
          vLineStyle: function (i, node) {
            return {dash: {length: 3, space: 1}};
          },
          hLineStyle: function (i, node) {
            return {dash: {length: 3, space: 1}};
          },
        }
      },
      
      ...layoutCupon
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
      tableCellEmpty: {
        margin: [10, 5, 10, 5]
      },
      tableFooterWithoutBorder: {
        fontSize: 7,
        color: 'black',
        border: [false, true, false, false]
      },
      tableDescripcion: {
        fontSize: 7
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
    pageSize: { height: 595,  width: 200 },
  }
}

export interface Data {
  idCita:           number;
  fechaHora:        Date;
  idCliente:        number;
  tipoCita:         string;
  cliente:          string;
  clienteDocumento: string;
  especialista:     null;
  usuario:          string;
  detalle:          Detalle[];
  notas:            DataNota[];
  nuevoCliente:     boolean;
  valeCupon:        ValeCupon;
  servicio?:         number;
}

export interface Detalle {
  sesion:  number;
  pagoWeb: boolean;
  precio:  number;
  zona:    string;
}

export interface DataNota {
  id:    number;
  texto: string;
}

export interface ValeCupon {
  cliente_documento: string;
  cliente_nombre:    string;
  fecha_compra:      Date;
  total:             number;
  descuento:         number;
  codigo_barra:      string;
  notas:             ValeCuponNota[];
  barcodeBase64:     string;
  fecha_termino:     string;
}

export interface ValeCuponNota {
  texto: string;
}
