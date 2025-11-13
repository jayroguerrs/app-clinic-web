import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { environment } from 'src/environments/environment';
import {catchError, map} from "rxjs/operators";
import {Page} from "../models/page";
import {ClienteImportClass} from "../models/cliente";
import {UtilsService} from "./funciones/utils.service";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {
  ET_FotoZona,
  EvolucionTratamiento,
  EvolucionTratamientoDosis,
  EvolucionTratamientoZona
} from "../models/evolucion-tratamiento";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class EvolucionTratamientoService {

  headers: HttpHeaders;

  constructor(
    private http: HttpClient,
    private utilsService: UtilsService
  ) {
    this.headers = new HttpHeaders({
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
    });
  }

  grabarEvolucion( evolucionTratamiento: EvolucionTratamiento ): Observable<boolean> {
    // Registra la historia clinica de la cita
    return this.http.post(`${environment.apiUrl}/api/evolucionTratamiento/`, evolucionTratamiento, {headers: this.headers})
      .pipe(
        map((res: any) => {
          return res.status === 200;
        }), catchError((err) => {
          return throwError(err);
        })
      );
  }

  obtenerEvolucionTratamientoByCita( idCita: number ): Observable<EvolucionTratamiento> {
    // Registra la historia clinica de la cita
    return this.http.get(`${environment.apiUrl}/api/evolucionTratamiento/cita/${idCita}`, {headers: this.headers})
      .pipe(
        map((res: any) => {

          //console.log('res',res);

          if( res.status !== 200 ){ throw throwError('Ocurrio un error');}

          if(!res.data){ return null;}

          const data = res.data;

          const evolucionTratamientoZonas: EvolucionTratamientoZona[] = [];
          data.zonas.forEach( z => {
            const collectionDosis: EvolucionTratamientoDosis[] = [];

            z.dosis.forEach( d => {
              const dosis = new EvolucionTratamientoDosis();
                dosis.id = d.id;
                dosis.idZona = d.idZona;
                dosis.zona = d.zona;
                dosis.valorJulios = d.valorJulios;
                dosis.valorContinuo = d.valorContinuo;
                dosis.valorStackMovil = d.valorStackMovil;
                dosis.valorStackFijo = d.valorStackFijo;
              collectionDosis.push(dosis);
            });

            const evolucionTratamientoZona = new EvolucionTratamientoZona();
              evolucionTratamientoZona.id = z.id;
              evolucionTratamientoZona.idEvolucionTratamiento = z.idEvolucionTratamiento;
              evolucionTratamientoZona.idCitaDetalle = z.idCitaDetalle;
              evolucionTratamientoZona.sesion = z.sesion;
              evolucionTratamientoZona.fototipoPiel = z.prototipoPiel;
              evolucionTratamientoZona.zona = z.zona;
              evolucionTratamientoZona.dosis = collectionDosis;
              evolucionTratamientoZona.idEquipoLaser = z.idEquipoLaser;
              evolucionTratamientoZona.equipoLaser = z.equipoLaser ? {
                id: z.equipoLaser.id,
                nombre: z.equipoLaser.nombre
              } : null;
              evolucionTratamientoZona.edema = z.edema;
              evolucionTratamientoZona.eritema = z.eritema;
              evolucionTratamientoZona.dolor = z.dolor;
              evolucionTratamientoZona.agujas = z.agujas;
              evolucionTratamientoZona.quemaduras = z.quemaduras;
              evolucionTratamientoZona.comentario = z.comentario;
              evolucionTratamientoZona.comentarioCliente = z.comentarioCliente;
              evolucionTratamientoZona.comentarioSesion = z.comentarioSesion;
              evolucionTratamientoZona.foto1 = null;
              evolucionTratamientoZona.foto2 = null;
              evolucionTratamientoZona.fechaRegistro = z.fechaRegistro ? new Date(z.fechaRegistro) : null;
              evolucionTratamientoZona.usuarioRegistro = z.usuarioRegistro;
              evolucionTratamientoZona.fechaModifico = z.fechaModifico ? new Date(z.fechaModifico) : null;
              evolucionTratamientoZona.usuarioModifico = z.usuarioModifico;
              evolucionTratamientoZona.idUsuarioRegistro = z.idUsuarioRegistro;
              evolucionTratamientoZona.idEstado = z.idEstado;
              evolucionTratamientoZona.hasEdit = false;

            evolucionTratamientoZonas.push(evolucionTratamientoZona);
          });

          const evolucionTratamiento = new EvolucionTratamiento();

            evolucionTratamiento.id = data.id;
            evolucionTratamiento.idCita = data.idCita;
            evolucionTratamiento.zonas = evolucionTratamientoZonas;
            evolucionTratamiento.fechaRegistro = data.fechaRegistro ? new Date(data.fechaRegistro) : null;
            evolucionTratamiento.usuarioRegistro = data.usuarioRegistro;
            evolucionTratamiento.fechaModifico = data.fechaRegistro ? new Date(data.fechaModifico) : null;
            evolucionTratamiento.usuarioModifico = data.usuarioModifico;
            evolucionTratamiento.idUsuarioRegistro = data.idUsuarioRegistro;
            evolucionTratamiento.idUsuarioAtendio = data.idUsuarioAtendio;
            evolucionTratamiento.usuarioAtendio = data.usuarioAtendio;
            evolucionTratamiento.idEstado = data.idEstado;

          return evolucionTratamiento;
        }), catchError((err) => {
          return throwError(err);
        })
      );
  }


  obtenerEvolucionTratamientoById( idHistoria: number ): Observable<EvolucionTratamiento> {
    // Registra la historia clinica de la cita
    return this.http.get(`${environment.apiUrl}/api/evolucionTratamiento/${idHistoria}`, {headers: this.headers})
      .pipe(
        map((res: any) => {

          const data = res.data;

          if(!data){ throw throwError('Ocurrio un error');}

          const evolucionTratamientoZonas: EvolucionTratamientoZona[] = [];
          data.zonas.forEach( z => {
            const collectionDosis: EvolucionTratamientoDosis[] = [];

            z.dosis.forEach( d => {
              const dosis = new EvolucionTratamientoDosis();
              dosis.id = d.id;
              dosis.idZona = d.idZona;
              dosis.zona = d.zona;
              dosis.valorJulios = d.valorJulios;
              dosis.valorContinuo = d.valorContinuo;
              dosis.valorStackMovil = d.valorStackMovil;
              dosis.valorStackFijo = d.valorStackFijo;
              collectionDosis.push(dosis);
            });

            const evolucionTratamientoZona = new EvolucionTratamientoZona();
            evolucionTratamientoZona.id = z.id;
            evolucionTratamientoZona.idEvolucionTratamiento = z.idEvolucionTratamiento;
            evolucionTratamientoZona.idCitaDetalle = z.idCitaDetalle;
            evolucionTratamientoZona.sesion = z.sesion;
            evolucionTratamientoZona.fototipoPiel = z.prototipoPiel;
            evolucionTratamientoZona.zona = z.zona;
            evolucionTratamientoZona.dosis = collectionDosis;
            evolucionTratamientoZona.idEquipoLaser = z.idEquipoLaser;
            evolucionTratamientoZona.equipoLaser = z.equipoLaser ? {
              id: z.equipoLaser.id,
              nombre: z.equipoLaser.nombre
            } : null;
            evolucionTratamientoZona.edema = z.edema;
            evolucionTratamientoZona.eritema = z.eritema;
            evolucionTratamientoZona.dolor = z.dolor;
            evolucionTratamientoZona.agujas = z.agujas;
            evolucionTratamientoZona.quemaduras = z.quemaduras;
            evolucionTratamientoZona.comentario = z.comentario;
            evolucionTratamientoZona.comentarioCliente = z.comentarioCliente;
            evolucionTratamientoZona.comentarioSesion = z.comentarioSesion;
            evolucionTratamientoZona.foto1 = null;
            evolucionTratamientoZona.foto2 = null;
            evolucionTratamientoZona.fechaRegistro = z.fechaRegistro ? new Date(z.fechaRegistro) : null;
            evolucionTratamientoZona.usuarioRegistro = z.usuarioRegistro;
            evolucionTratamientoZona.fechaModifico = z.fechaModifico ? new Date(z.fechaModifico) : null;
            evolucionTratamientoZona.usuarioModifico = z.usuarioModifico;
            evolucionTratamientoZona.idUsuarioRegistro = z.idUsuarioRegistro;
            evolucionTratamientoZona.idEstado = z.idEstado;
            evolucionTratamientoZona.hasEdit = false;

            evolucionTratamientoZonas.push(evolucionTratamientoZona);
          });

          const evolucionTratamiento = new EvolucionTratamiento();
          evolucionTratamiento.id = data.id;
          evolucionTratamiento.idCita = data.idCita;
          evolucionTratamiento.zonas = evolucionTratamientoZonas;
          evolucionTratamiento.fechaRegistro = data.fechaRegistro ? new Date(data.fechaRegistro) : null;
          evolucionTratamiento.usuarioRegistro = data.usuarioRegistro;
          evolucionTratamiento.fechaModifico = data.fechaRegistro ? new Date(data.fechaModifico) : null;
          evolucionTratamiento.usuarioModifico = data.usuarioModifico;
          evolucionTratamiento.idUsuarioRegistro = data.idUsuarioRegistro;
          evolucionTratamiento.idUsuarioAtendio = data.idUsuarioAtendio;
          evolucionTratamiento.usuarioAtendio = data.usuarioAtendio;
          evolucionTratamiento.idEstado = data.idEstado;

          return evolucionTratamiento;
        }), catchError((err) => {
          return throwError(err);
        })
      );
  }


  obtenerListadoByIdCliente( idCliente: number ): Observable<EvolucionTratamiento[]> {
    // Registra la historia clinica de la cita
    return this.http.get(`${environment.apiUrl}/api/evolucionTratamiento/cliente/${idCliente}`, {headers: this.headers})
      .pipe(
        map((res: any) => {

          const data = res.data;

          const collectionEvolucionTratamiento:EvolucionTratamiento[] = [];

          data.forEach( (h) => {

            const evolucionTratamiento = new EvolucionTratamiento();
              evolucionTratamiento.id = h.id;
              evolucionTratamiento.idCita = h.idCita;
              evolucionTratamiento.zonas = [];
              evolucionTratamiento.fechaRegistro = h.fechaRegistro ? new Date(h.fechaRegistro) : null;
              evolucionTratamiento.usuarioRegistro = h.usuarioRegistro;
              evolucionTratamiento.fechaModifico = h.fechaRegistro ? new Date(h.fechaModifico) : null;
              evolucionTratamiento.usuarioModifico = h.usuarioModifico;
              evolucionTratamiento.idUsuarioRegistro = h.idUsuarioRegistro;
              evolucionTratamiento.usuarioAtendio = h.usuarioAtendio;
              evolucionTratamiento.idEstado = h.idEstado;


            collectionEvolucionTratamiento.push( evolucionTratamiento );
          });

          return collectionEvolucionTratamiento;
        }), catchError((err) => {
          return throwError(err);
        })
      );
  }


  obtenerFotosById( idEvolucionTratamiento: number ): Observable<ET_FotoZona> {
    // Registra la historia clinica de la cita
    return this.http.get(`${environment.apiUrl}/api/evolucionTratamiento/historiaZona/${idEvolucionTratamiento}/fotos`, {headers: this.headers})
      .pipe(
        map((res: any) => {

          const data = res.data;
          const fotos = new ET_FotoZona();
          fotos.foto1 = data.foto1;
          fotos.foto2 = data.foto2;

          return fotos;
        }), catchError((err) => {
          return throwError(err);
        })
      );
  }


  // Funciones

  exportarEvolucionTratamientoPdf(evolucionTratamiento: EvolucionTratamiento, cliente: ClienteImportClass, cabecera: string, piePagina: string, view: boolean = false): void{

    const page = new Page();
    page.pageMargins = [70,160,70,50];
    page.header = {
      image: cabecera,
      width: 595,
      height: 160,
      alignment: "center",
    };
    page.footer = {
      image: piePagina,
      width: 595,
      height: 35,
      alignment: "center",
      margin: [0,15,0,0]
    };
    page.defaultStyle = {
      fontSize: 10
    }
    page.styles = {
      title:{
        fontSize: 10,
        bold: true,
        alignment: 'center'
      }
    }

    page.content = [
      {
        text: 'EVOLUCIÓN DEL TRATAMIENTO DE DEPILACIÓN LÁSER',
        style: 'title',
        margin: [0,0,0,20],
        bold: true
      }
    ];

    page.content.push({
      margin: [0,0,0,20],
      table: {
        widths: ['*', 143],
        body: [
          [{text:'N° '+ 'EVT-' + evolucionTratamiento.id.toString().padStart(8,'0'),bold:true},{text: [
              'Fecha: ',
              {text: this.utilsService.formato_FechaString(evolucionTratamiento.fechaRegistro) , bold:false, alignment: 'right'}],
            bold: true,
          }],
          [{text: [
              'Paciente: ',
              {text: cliente.nombresCompletos, bold:false}],
            bold: true,
          }, {text: [
              'N° Documento: ',
              {text: cliente.documento, bold:false}],
            bold: true,
          }],[{text: [
              'Especialista: ',
              {text: evolucionTratamiento.usuarioAtendio, bold:false}],
            bold: true,
          }, {text: [
              'N° Cita: ',
              {text: evolucionTratamiento.idCita, bold:false}],
            bold: true,
          }]
        ]
      },
      layout: {
        hLineWidth: function (i, node) {
          return 0.5;
        },
        vLineWidth: function (i, node) {
          return 0.5;
        }
      }
    });

    evolucionTratamiento.zonas.forEach((h) => {

      page.content.push({
        margin: [0,0,0,4],
        table: {
          widths: ['*', '*', '*'],
          body: [
            [{text: 'ZONA', bold: true, alignment: 'center'},{text: 'FOTOTIPO PIEL', bold: true, alignment: 'center'},{text: 'N° SESIÓN', bold: true, alignment: 'center'}],
            [{text: h.zona, alignment: 'center'}, {text: this.utilsService.convertRoman(h.fototipoPiel), alignment: 'center' }, {text: h.sesion, alignment: 'center' }]
          ]
        },
        layout: {
          hLineWidth: function (i, node) {
            return 0.5;
          },
          vLineWidth: function (i, node) {
            return 0.5;
          }
        }
      });

      page.content.push({
        margin: [0,0,0,4],
        table: {
          widths: ['*', '*','*','*','*'],
          headerRows: 1,
          body: [
            [{text:'REACCIONES',bold:true,alignment: 'center',colSpan: 5},{},{},{},{}],
            [{text:'EDEMA', bold: true, alignment: 'center'},{text:'ERITEMA', bold: true, alignment: 'center'},{text:'DOLOR', bold: true, alignment: 'center'},{text:'AGUJAS', bold: true, alignment: 'center'},{text:'QUEMADURAS', bold: true, alignment: 'center'}],
            [{text: h.edema, alignment: 'center'},{text: h.eritema, alignment: 'center'},{text: h.dolor, alignment: 'center'},{text: h.agujas, alignment: 'center'},{text: h.quemaduras ? 'Si' : 'No', alignment: 'center'}]
          ]
        },
        layout: {
          hLineWidth: function (i, node) {
            return 0.5;
          },
          vLineWidth: function (i, node) {
            return 0.5;
          }
        }
      });

      const subZonas: any = {
        margin: [0,0,0,4],
        table: {
          widths: [100, '*','*','*','*'],
          body: [
            [{text:'EQUIPO UTILIZADO',bold:true},{text: h.equipoLaser ? h.equipoLaser.nombre.toUpperCase() : '', colSpan: 4, alignment: 'center'},{},{},{}],
            [{text:'SUB-ZONA / DOSIS',bold:true},{text:'Julios', alignment: 'center', bold: true},{text:'Continuo/Kj', alignment: 'center', bold: true},{text:'Stack Movil Pt/Kj', alignment: 'center', bold: true},{text:'Stack Fijo Pt/p', alignment: 'center', bold: true}],
          ]
        },
        layout: {
          hLineWidth: function (i, node) {
            return 0.5;
          },
          vLineWidth: function (i, node) {
            return 0.5;
          }
        }
      };

      h.dosis.forEach( d => {
        subZonas.table.body.push([
          {text:d.zona},
          {text:d.valorJulios, alignment: 'center'},
          {text:d.valorContinuo, alignment: 'center'},
          {text:d.valorStackMovil, alignment: 'center'},
          {text:d.valorStackFijo, alignment: 'center'}
        ])
      });

      page.content.push(subZonas);

      page.content.push({
        margin: [0,0,0,20],
        table: {
          widths: ['*'],
          body: [
            [{text: 'COMENTARIO:', bold: true, border: [true,true,true,false]}],
            [{text: h.comentario,border: [true,false,true,true]}],
            [{text: 'COMENTARIO CLIENTE:', bold: true, border: [true,true,true,false]}],
            [{text: h.comentarioCliente,border: [true,false,true,true]}],
            [{text: 'COMENTARIO DEL RETOQUE:', bold: true, border: [true,true,true,false]}],
            [{text: h.comentarioSesion,border: [true,false,true,true]}]
          ]
        },
        layout: {
          hLineWidth: function (i, node) {
            return 0.5;
          },
          vLineWidth: function (i, node) {
            return 0.5;
          }
        }
      });

    });
    if(view){
      pdfMake.createPdf(page).open();
    }else{
      pdfMake.createPdf(page).download('Evolución tratamiento laser - Cita N°'+evolucionTratamiento.idCita+'.pdf');
    }
  }

}
