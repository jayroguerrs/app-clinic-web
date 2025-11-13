import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Subscriber, throwError} from 'rxjs';
import { environment } from 'src/environments/environment';
import { HistoriaClinicaCliente} from "../models/historia-clinica";
import {catchError, map} from "rxjs/operators";
import {
  RDosisSubZonas,
  RFotoHistoriaClinica,
  RHistoriaClinica,
  RHistoriaClinicaZona
} from "../interfaces/Response/historia-clinica";
import {Page} from "../models/page";
import {ClienteImportClass} from "../models/cliente";
import {UtilsService} from "./funciones/utils.service";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import {
  BebeAlcohol,
  MedioComunicacionCliente,
  MedioContacto, ReaccionAlergicaCutanea,
  TipoCicatrizacion,
  Ultimos12MesesSeHizo
} from "../enumeracion/enums";
import {ErrorSistema} from "../models/error-sistema";
import {FichaAdmision} from "../models/ficha-admision";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class HistoriaClinicaService {

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

  grabarHistoria( historiaClinica: HistoriaClinicaCliente ): Observable<HistoriaClinicaCliente | ErrorSistema> {
    // Registra la historia clinica de la cita
    return this.http.post(`${environment.apiUrl}/api/historiaClinica/`, historiaClinica, {headers: this.headers})
      .pipe(
        map((res: any) => {
          if( res.status === 200 ){
            const historia = new HistoriaClinicaCliente();
            historia.id = res.data.id;
            historia.idCliente = res.data.idCliente;
            historia.idUsuarioRegistro = res.data.idUsuarioRegistro;
            historia.fechaHistoria = new Date(res.data.fechaHistoria);
            historia.fechaRegistro = new Date(res.data.fechaRegistro);
            return historia;
          }else{
            const errorSistema = new ErrorSistema();
            errorSistema.message = res.message;
            errorSistema.status = res.status;
            return errorSistema;
          }
        }), catchError((err) => {
          return throwError(err);
        })
      );
  }

  anular( idHistoria: number, idUsuario: number ): Observable<boolean | ErrorSistema> {
    // Registra la historia clinica de la cita
    return this.http.put(`${environment.apiUrl}/api/historiaClinica/anular/${idHistoria}/${idUsuario}`, null, {headers: this.headers})
      .pipe(
        map((res: any) => {
          if( res.status === 200 ){
            return true;
          }else{
            const error = new ErrorSistema();
            error.message = res.mensaje;
            error.status = res.status;
            return error;
          }
        }), catchError((err) => {
          return throwError(err);
        })
      );
  }

  obtenerHistoriaClinicaByCita( idCita: number ): Observable<RHistoriaClinica | null> {
    // Registra la historia clinica de la cita
    return this.http.get(`${environment.apiUrl}/api/historiaClinica/cita/${idCita}`, {headers: this.headers})
      .pipe(
        map((res: any) => {

          const data = res.data;

          if(!data){return null; }

          const historiaZonas: RHistoriaClinicaZona[] = [];
          data.zonas.forEach( z => {
            const collectionDosis: RDosisSubZonas[] = [];

            z.dosis.forEach( d => {
              const dosis: RDosisSubZonas = {
                id: d.id,
                idZona: d.idZona,
                zona: d.zona,
                valorJulios: d.valorJulios,
                valorContinuo: d.valorContinuo,
                valorStackMovil: d.valorStackMovil,
                valorStackFijo: d.valorStackFijo
              };
              collectionDosis.push(dosis);
            });

            const historiaZona: RHistoriaClinicaZona = {
              id: z.id,
              idHistoriaClinica: z.idHistoriaClinica,
              idCitaDetalle: z.idCitaDetalle,
              sesion: z.sesion,
              prototipoPiel: z.prototipoPiel,
              zona: z.zona,
              dosis: collectionDosis,
              idEquipoLaser: z.idEquipoLaser,
              equipoLaser: {
                id: z.equipoLaser.id,
                nombre: z.equipoLaser.nombre
              },
              edema: z.edema,
              eritema: z.eritema,
              dolor: z.dolor,
              agujas: z.agujas,
              quemaduras: z.quemaduras,
              comentario: z.comentario,
              comentarioCliente: z.comentarioCliente,
              comentarioSesion: z.comentarioSesion,
              foto1: null,
              foto2: null,
              fechaRegistro: z.fechaRegistro ? new Date(z.fechaRegistro) : null,
              usuarioRegistro: z.usuarioRegistro,
              fechaModifico: z.fechaModifico ? new Date(z.fechaModifico) : null,
              usuarioModifico: z.usuarioModifico,
              idEstado: z.idEstado,
              hasEdit: false
            };
            historiaZonas.push(historiaZona);
          });

          const rHistoriaClinica: RHistoriaClinica = {
            id: data.id,
            idCita: data.idCita,
            zonas: historiaZonas,
            fechaRegistro: data.fechaRegistro ? new Date(data.fechaRegistro) : null,
            usuarioRegistro: data.usuarioRegistro,
            fechaModifico: data.fechaRegistro ? new Date(data.fechaModifico) : null,
            usuarioModifico: data.usuarioModifico,
            idEstado: data.idEstado,
          };

          return rHistoriaClinica;
        }), catchError((err) => {
          return throwError(err);
        })
      );
  }


  obtenerHistoriaClinicaById( idHistoria: number ): Observable<RHistoriaClinica | null> {
    // Registra la historia clinica de la cita
    return this.http.get(`${environment.apiUrl}/api/historiaClinica/${idHistoria}`, {headers: this.headers})
      .pipe(
        map((res: any) => {

          const data = res.data;

          if(!data){return null; }

          const historiaZonas: RHistoriaClinicaZona[] = [];
          data.zonas.forEach( z => {
            const collectionDosis: RDosisSubZonas[] = [];


            z.dosis.forEach( d => {
              const dosis: RDosisSubZonas = {
                id: d.id,
                idZona: d.idZona,
                zona: d.zona,
                valorJulios: d.valorJulios,
                valorContinuo: d.valorContinuo,
                valorStackMovil: d.valorStackMovil,
                valorStackFijo: d.valorStackFijo
              };
              collectionDosis.push(dosis);
            });

            const historiaZona: RHistoriaClinicaZona = {
              id: z.id,
              idHistoriaClinica: z.idHistoriaClinica,
              idCitaDetalle: z.idCitaDetalle,
              sesion: z.sesion,
              prototipoPiel: z.prototipoPiel,
              zona: z.zona,
              dosis: collectionDosis,
              idEquipoLaser: z.idEquipoLaser,
              equipoLaser: {
                id: z.equipoLaser.id,
                nombre: z.equipoLaser.nombre
              },
              edema: z.edema,
              eritema: z.eritema,
              dolor: z.dolor,
              agujas: z.agujas,
              quemaduras: z.quemaduras,
              comentario: z.comentario,
              comentarioCliente: z.comentarioCliente,
              comentarioSesion: z.comentarioSesion,
              foto1: null,
              foto2: null,
              fechaRegistro: z.fechaRegistro ? new Date(z.fechaRegistro) : null,
              usuarioRegistro: z.usuarioRegistro,
              fechaModifico: z.fechaModifico ? new Date(z.fechaModifico) : null,
              usuarioModifico: z.usuarioModifico,
              idEstado: z.idEstado,
              hasEdit: false
            };
            historiaZonas.push(historiaZona);
          });

          const rHistoriaClinica: RHistoriaClinica = {
            id: data.id,
            idCita: data.idCita,
            zonas: historiaZonas,
            fechaRegistro: data.fechaRegistro ? new Date(data.fechaRegistro) : null,
            usuarioRegistro: data.usuarioRegistro,
            fechaModifico: data.fechaRegistro ? new Date(data.fechaModifico) : null,
            usuarioModifico: data.usuarioModifico,
            idEstado: data.idEstado,
          };

          return rHistoriaClinica;
        }), catchError((err) => {
          return throwError(err);
        })
      );
  }


  obtenerListadoByIdCliente( idCliente: number ): Observable<FichaAdmision[]> {
    // Registra la historia clinica de la cita
    return this.http.get(`${environment.apiUrl}/api/historiaClinica/cliente/${idCliente}/lista`, {headers: this.headers})
      .pipe(
        map((res: any) => {
          const data = res.data;

          const collection: FichaAdmision[] = [];

          data.forEach( (h) => {
            const fichaAdmision: FichaAdmision = new FichaAdmision();

            fichaAdmision.id = h.id;
            fichaAdmision.idCliente = h.idCliente;
            fichaAdmision.fechaRegistro = new Date(h.fechaRegistro);
            fichaAdmision.fechaModifico = h.fechaModifico ? new Date(h.fechaModifico) : null;
            fichaAdmision.usuarioRegistro = h.usuarioRegistro;
            fichaAdmision.usuarioModifico= h.usuarioModifico;

            collection.push( fichaAdmision );
          });

          return collection;
        }), catchError((err) => {
          return throwError(err);
        })
      );
  }

  obtenerListadoByIdClientePorServicio( idCliente: number, idServicio: number ): Observable<FichaAdmision[]> {
    // Registra la historia clinica de la cita
    return this.http.get(`${environment.apiUrl}/api/historiaClinica/cliente/${idCliente}/servicio/${idServicio}/lista`, {headers: this.headers})
      .pipe(
        map((res: any) => {
          const data = res.data;

          const collection: FichaAdmision[] = [];

          data.forEach( (h) => {
            const fichaAdmision: FichaAdmision = new FichaAdmision();

            fichaAdmision.id = h.id;
            fichaAdmision.idCliente = h.idCliente;
            fichaAdmision.fechaRegistro = new Date(h.fechaRegistro);
            fichaAdmision.fechaModifico = h.fechaModifico ? new Date(h.fechaModifico) : null;
            fichaAdmision.usuarioRegistro = h.usuarioRegistro;
            fichaAdmision.usuarioModifico= h.usuarioModifico;

            collection.push( fichaAdmision );
          });

          return collection;
        }), catchError((err) => {
          return throwError(err);
        })
      );
  }


  obtenerFotosById( idHistoriaClinica: number ): Observable<RFotoHistoriaClinica> {
    // Registra la historia clinica de la cita
    return this.http.get(`${environment.apiUrl}/api/historiaClinica/historiaZona/${idHistoriaClinica}/fotos`, {headers: this.headers})
      .pipe(
        map((res: any) => {

          const data = res.data;
          const fotos: RFotoHistoriaClinica = {
            foto1: data.foto1,
            foto2: data.foto2
          }

          return fotos;
        }), catchError((err) => {
          return throwError(err);
        })
      );
  }


  // Funciones
  exportarHistoriaClinicaPdf(historiaClinica: RHistoriaClinica, cliente: ClienteImportClass, cabecera: string, piePagina: string, view: boolean = false): void{

    const page = new Page();
    page.pageMargins = [70,170,70,50];
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
          [{text:'N° '+ 'EVT-' + historiaClinica.id.toString().padStart(6,'0'),bold:true},{text: [
              'Fecha: ',
              {text: this.utilsService.formato_FechaString(historiaClinica.fechaRegistro) , bold:false, alignment: 'right'}],
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
              {text: historiaClinica.usuarioRegistro, bold:false}],
            bold: true,
          }, {text: [
              'N° Cita: ',
              {text: historiaClinica.idCita, bold:false}],
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

    historiaClinica.zonas.forEach((h) => {

      page.content.push({
        margin: [0,0,0,4],
        table: {
          widths: ['*', '*', '*'],
          body: [
            [{text: 'ZONA', bold: true, alignment: 'center'},{text: 'PROTOTIPO PIEL', bold: true, alignment: 'center'},{text: 'N° SESIÓN', bold: true, alignment: 'center'}],
            [{text: h.zona, alignment: 'center'}, {text: this.utilsService.convertRoman(h.prototipoPiel), alignment: 'center' }, {text: h.sesion, alignment: 'center' }]
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
            [{text:'EQUIPO UTILIZADO',bold:true},{text:h.equipoLaser.nombre.toUpperCase(), colSpan: 4, alignment: 'center'},{},{},{}],
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
            [{text: 'COMENTARIO', bold: true}],
            [{text: h.comentario}],
            [{text: 'COMENTARIO CLIENTE', bold: true}],
            [{text: h.comentarioCliente}],
            [{text: 'COMENTARIO DE LA SESIÓN', bold: true}],
            [{text: h.comentarioSesion}]
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
      pdfMake.createPdf(page).download('Evolución tratamiento laser - Cita N°'+historiaClinica.idCita+'.pdf');
    }
  }

  obtenerDetallesCliente( idCliente: number ): Observable<HistoriaClinicaCliente | ErrorSistema> {
    return this.http.get(`${environment.apiUrl}/api/historiaClinica/cliente/${idCliente}`, {headers: this.headers}).pipe(
      map( (res: any) => {
        if( res.status === 200 ){
          const data = res.data;
          const historiaCliente = new HistoriaClinicaCliente();
          historiaCliente.idFichaAdmision = data.idFichaAdmision;
          historiaCliente.idCliente = data.idCliente;
          historiaCliente.nombreCompleto = data.nombreCompleto;
          historiaCliente.telefono = data.telefono;
          historiaCliente.domicilio = data.domicilio;
          historiaCliente.edad = data.edad;
          historiaCliente.fechaNacimiento = data.fechaNacimiento;
          historiaCliente.estadoCivil = data.estadoCivil;
          historiaCliente.fototipoPiel = data.fototipoPiel;
          historiaCliente.tipoDocumento = data.tipoDocumento;
          historiaCliente.documento = data.documento;
          historiaCliente.profesion = data.profesion;
          historiaCliente.email = data.email;

          historiaCliente.alergMedicamentos = data.alergMedicamentos ? data.alergMedicamentos : 'No registra';
          historiaCliente.antecMedico = data.antecMedico ? data.antecMedico : 'No registra';
          historiaCliente.antecQuirurgico = data.antecQuirurgico ? data.antecQuirurgico : 'No registra';
          historiaCliente.antecTrataFarmaco = data.antecTrataFarmaco ? data.antecTrataFarmaco : 'No registra';
          historiaCliente.antecTrataEstetic = data.antecTrataEstetic ? data.antecTrataEstetic : 'No registra';

          historiaCliente.patologias = data.patologias;

          historiaCliente.peso = data.peso ? data.peso : 0;
          historiaCliente.altura = data.altura ? data.altura : 0;
          historiaCliente.numeroHijos = data.numeroHijos ? data.numeroHijos : 0;

          historiaCliente.tipoCicatrizacion = data.tipoCicatrizacion ? data.tipoCicatrizacion : 0;

          historiaCliente.bebeAlcohol = data.bebeAlcohol ? data.bebeAlcohol : 0;

          historiaCliente.esFumador = data.esFumador ? data.esFumador : 0;

          historiaCliente.tieneMedicacion = data.tieneMedicacion ? data.tieneMedicacion : 0;
          historiaCliente.indiqueMedicacion = data.indiqueMedicacion ? data.indiqueMedicacion : null;

          historiaCliente.comunicacionCliente = data.comunicacionCliente ? data.comunicacionCliente : 0;

          historiaCliente.observaciones = data.observaciones ? data.observaciones : 'No tiene';

          historiaCliente.ultimos12meses = data.ultimos12meses ? data.ultimos12meses : 0;
          historiaCliente.antecedenteFamiliar = data.antecedenteFamiliar ? data.antecedenteFamiliar : 0;
          historiaCliente.reaccionAlergicaCutanea = data.reaccionAlergicaCutanea ? data.reaccionAlergicaCutanea : 0;
          historiaCliente.embarazoSospecha = data.embarazoSospecha;
          historiaCliente.cigarrosAldia = data.cigarrosAldia ? data.cigarrosAldia : 0;
          historiaCliente.idMedioContacto = data.idMedioContacto ? data.idMedioContacto : 0;
          historiaCliente.genero = data.genero ? data.genero : '';

          return historiaCliente;
        }else{
          const error = new ErrorSistema();
          error.message = res.mensaje;
          error.status = res.status;
          return error;
        }
      }), catchError( error => {
        return throwError(error);
      })
    );
  }

  obtenerDetallesByHistoria( idHistoria: number ): Observable<HistoriaClinicaCliente | ErrorSistema> {
    return this.http.get(`${environment.apiUrl}/api/historiaClinica/${idHistoria}`, {headers: this.headers}).pipe(
      map( (res: any) => {
        if( res.status === 200 ){
          const data = res.data;

          const historiaCliente = new HistoriaClinicaCliente();
          historiaCliente.fechaHistoria = new Date(data.fechaHistoria);
          historiaCliente.idFichaAdmision = data.idFichaAdmision;
          historiaCliente.idCliente = data.idCliente;
          historiaCliente.nombreCompleto = data.nombreCompleto;
          historiaCliente.telefono = data.telefono;
          historiaCliente.domicilio = data.domicilio;
          historiaCliente.edad = data.edad;
          historiaCliente.fechaNacimiento = data.fechaNacimiento;
          historiaCliente.estadoCivil = data.estadoCivil;
          historiaCliente.fototipoPiel = data.fototipoPiel;
          historiaCliente.tipoDocumento = data.tipoDocumento;
          historiaCliente.documento = data.documento;
          historiaCliente.profesion = data.profesion;
          historiaCliente.email = data.email;

          historiaCliente.alergMedicamentos = data.alergMedicamentos ? data.alergMedicamentos : 'No registra';
          historiaCliente.antecMedico = data.antecMedico ? data.antecMedico : 'No registra';
          historiaCliente.antecQuirurgico = data.antecQuirurgico ? data.antecQuirurgico : 'No registra';
          historiaCliente.antecTrataFarmaco = data.antecTrataFarmaco ? data.antecTrataFarmaco : 'No registra';
          historiaCliente.antecTrataEstetic = data.antecTrataEstetic ? data.antecTrataEstetic : 'No registra';

          historiaCliente.patologias = data.patologias;

          historiaCliente.peso = data.peso ? data.peso : 0;
          historiaCliente.altura = data.altura ? data.altura : 0;
          historiaCliente.numeroHijos = data.numeroHijos ? data.numeroHijos : 0;

          historiaCliente.tipoCicatrizacion = data.tipoCicatrizacion ? data.tipoCicatrizacion : 0;

          historiaCliente.bebeAlcohol = data.bebeAlcohol ? data.bebeAlcohol : 0;

          historiaCliente.esFumador = data.esFumador ? data.esFumador : 0;

          historiaCliente.tieneMedicacion = data.tieneMedicacion ? data.tieneMedicacion : 0;
          historiaCliente.indiqueMedicacion = data.indiqueMedicacion ? data.indiqueMedicacion : null;

          historiaCliente.comunicacionCliente = data.comunicacionCliente ? data.comunicacionCliente : 0;

          historiaCliente.observaciones = data.observaciones ? data.observaciones : 'No tiene';

          historiaCliente.ultimos12meses = data.ultimos12meses ? data.ultimos12meses : 0;
          historiaCliente.antecedenteFamiliar = data.antecedenteFamiliar ? data.antecedenteFamiliar : 0;
          historiaCliente.reaccionAlergicaCutanea = data.reaccionAlergicaCutanea ? data.reaccionAlergicaCutanea : 0;
          historiaCliente.embarazoSospecha = data.embarazoSospecha;
          historiaCliente.cigarrosAldia = data.cigarrosAldia ? data.cigarrosAldia : 0;
          historiaCliente.idMedioContacto = data.idMedioContacto ? data.idMedioContacto : 0;
          historiaCliente.genero = data.genero ? data.genero : '';

          historiaCliente.zonasConsultar = data.zonasConsultar;
          historiaCliente.zonasRealizar = data.zonasRealizar;

          historiaCliente.idEstado = data.idEstado;

          return historiaCliente;
        }else{
          const error = new ErrorSistema();
          error.message = res.mensaje;
          error.status = res.status;
          return error;
        }
      }), catchError( error => {
        return throwError(error);
      })
    );
  }

  generarHistoriaClinicaPdf(content: any[], header:string, footer: string, margin: number[], defaultStyle: {}, estado: number = 1, view: boolean = false): Observable<any>{

    return new Observable((observer) => {

      const page = new Page();
      page.pageMargins = margin;
      page.header = {
        image: header,
        width: 595,
        height: 160,
        alignment: "center",
      };
      page.footer = {
        image: footer,
        width: 595,
        height: 35,
        alignment: "center",
        margin: [0,15,0,0]
      };
      page.defaultStyle = defaultStyle;
      page.styles = {

      };
      //console.log(JSON.parse(plantilla.plantilla));
      page.content = content;

      if(!estado){
        page.watermark = { text: 'ANULADO', color: 'red', opacity: 0.5, bold: true, italics: false };
      }

      const docPdf = pdfMake.createPdf(page);
      observer.next(docPdf);

      // When the consumer unsubscribes, clean up data ready for next subscription.
      return {
        unsubscribe(){
        }
      };
    });

  }

  // pdf
  generarDocumentoHistoriaClinica( clienteDetalle: HistoriaClinicaCliente ): Observable<any[]>{

    return new Observable((observer:Subscriber<any[]>) => {

      const content: any[] = [
        {
          text: 'Ficha Clínica #' + clienteDetalle.idFichaAdmision.toString().padStart(8,'0'),
          alignment: 'center',
          margin: [0,0,0,20],
          bold: true
        }
      ];

      content.push({
        margin: [0,0,0,5],
        table: {
          widths: ['*', 160],
          body: [
            [{text: [
                'Paciente: ',
                {text: clienteDetalle.nombreCompleto, bold:false}],
              bold: true,
            }, {text: [
                'Edad: ',
                {text: clienteDetalle.edad, bold:false}],
              bold: true,
            }],[{text: [
                'Teléfono / Celular: ',
                {text: clienteDetalle.telefono, bold:false}],
              bold: true,
            }, {text: [
                'Fototipo de piel: ',
                {text: clienteDetalle.fototipoPiel, bold:false}],
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

      content.push({
        margin: [0,0,0,5],
        table: {
          widths: ['*'],
          body: [
            [{text: 'Alergias medicamentosas',bold:true,fillColor: '#53aae0'}],
            [{text: clienteDetalle.alergMedicamentos, bold:false, alignment: 'justify'}]
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

      content.push({
        margin: [0,0,0,5],
        table: {
          widths: ['*'],
          body: [
            [{text: 'Antecedentes personales',bold:true, fillColor: '#53aae0'}],
            [{text: 'Médicos:', bold:true, border: [true,true,true,false]}],
            [{text: clienteDetalle.antecMedico, bold:false, alignment: 'justify', border: [true,false,true,false]}],
            [{text: 'Quirúrgicos:', bold:true, border: [true,true,true,false]}],
            [{text: clienteDetalle.antecQuirurgico, bold:false, alignment: 'justify', border: [true,false,true,false]}],
            [{text: 'Tratamientos farmacológicos', bold:true, border: [true,true,true,false]}],
            [{text: clienteDetalle.antecTrataFarmaco, bold:false, alignment: 'justify', border: [true,false,true,false]}],
            [{text: 'Tratamientos estéticos previos:', bold:true, border: [true,true,true,false]}],
            [{text: clienteDetalle.antecTrataEstetic, bold:false, alignment: 'justify', border: [true,false,true,true]}],
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

      content.push({
        margin: [0,0,0,0],
        table: {
          widths: ['*'],
          body: [
            [{text: 'Motivo de consulta',bold:true, fillColor: '#53aae0'}],
            [{text: 'ELIMINACIÓN DE VELLO NO DESEADO (NO VELLO CANO):', bold:false}]
          ]
        },
        layout: {
          hLineWidth: function (i, node) {
            return 0.5;
          },
          vLineWidth: function (i, node) {
            return 0.5;
          }
        },
        pageBreak: 'after'
      });

      observer.next(content);

      // When the consumer unsubscribes, clean up data ready for next subscription.
      return {
        unsubscribe(){
        }
      };
    });
  }

  generarDocumentoFichaCliente( clienteDetalle: HistoriaClinicaCliente ): Observable<any[]>{
    return new Observable((observer:Subscriber<any[]>) => {

      const content: any[] = [
        {
          text: 'FICHA CLIENTE',
          alignment: 'center',
          margin: [0,0,0,20],
          bold: true
        }
      ];

      /** Datos del paciente **/
      content.push({
        margin: [0,0,0,5],
        table: {
          widths: ['*', '*', '*'],
          body: [
            [{text: [
                'Nombres y Apellidos: ',
                {text: clienteDetalle.nombreCompleto, bold:false}],
              bold: true,
              colSpan: 2
            },'',{text: [
                clienteDetalle.tipoDocumento+': ',
                {text: clienteDetalle.documento, bold:false}],
              bold: true,
            }],
            [{text: [
                'Fecha Nacimiento: ',
                {text: this.utilsService.formato_FechaString(clienteDetalle.fechaNacimiento), bold:false}],
              bold: true,
            }, {text: [
                'Edad: ',
                {text: clienteDetalle.edad, bold:false}],
              bold: true,
            },{text: [
                'Estado Civil: ',
                {text: clienteDetalle.estadoCivil, bold:false}],
              bold: true,
            }],
            [{text: [
                'Profesión: ',
                {text: clienteDetalle.profesion, bold:false}],
              bold: true,
            }, {text: [
                'Teléfono / Celular: ',
                {text: clienteDetalle.telefono, bold:false}],
              bold: true,
            },{text: [
                'E-mail: ',
                {text: clienteDetalle.email, bold:false}],
              bold: true,
            }],
            [{text: [
                'Domicilio: ',
                {text: clienteDetalle.domicilio, bold:false}],
              bold: true,
              colSpan: 2
            },'',{text: [
                'Genero: ',
                {text: this.capitalizeFirstLetter( clienteDetalle.genero.toLowerCase() ), bold:false}],
              bold: true
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

      /** Zonas a consultar **/
      content.push({
        margin: [0,0,0,5],
        table: {
          widths: ['*'],
          body: [
            [{text: 'Zonas a consultar:',
              bold: true,
              fillColor: '#53aae0'
            }],
            [{stack: [{ul: clienteDetalle.zonasConsultar.map(x => x.nombre)
            }]}]
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
      /** Zonas a realizar **/
      content.push({
        margin: [0,0,0,5],
        table: {
          widths: ['*'],
          body: [
            [{text: 'Zonas a realizar:',
              bold: true,
              fillColor: '#53aae0'
            }],
            [{stack: [{ul: clienteDetalle.zonasRealizar.map(x => x.nombre)
              }]}]
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

      /** Datos estadisticos **/
      content.push({
        margin: [0,0,0,5],
        table: {
          widths: ['*', '*', '*'],
          body: [
            [{text: 'Datos estadísticos:',
              bold: true,
              colSpan: 3,
              fillColor: '#53aae0'
            },'',''],
            [{text: [
                'Peso: ',
                {text: clienteDetalle.peso ? clienteDetalle.peso + ' kg' : '', bold:false}],
              bold: false,
            }, {text: [
                'Altura: ',
                {text: clienteDetalle.altura ? clienteDetalle.altura : '', bold:false}],
              bold: false,
            },{text: [
                'Hijos: ',
                {text: clienteDetalle.numeroHijos ? clienteDetalle.numeroHijos : 0, bold:false}],
              bold: false,
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

      const ultimos12Meses = clienteDetalle.ultimos12meses ? clienteDetalle.ultimos12meses.split(',').map( x => parseInt(x,10)) : [];
      /** En los ultimos meses ah hecho **/
      content.push({
        margin: [0,0,0,5],
        table: {
          widths: ['*', '*', '*'],
          body: [
            [{text: 'En los últimos meses se ha hecho:',
              bold: true,
              colSpan: 3,
              fillColor: '#53aae0'
            },'',''],
            Ultimos12MesesSeHizo.map( u => {
              return {text: [
                  u.value + ' ',
                  {text: ultimos12Meses.includes(u.index) ? '( x )': '(    )', bold:false}],
                bold: false,
              }
            })
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

      /** Patologias **/
      const patologias: any = {
        margin: [0,0,0,5],
        table: {
          widths: ['*','*', '*'],
          body: [
            [{text: 'Tiene o ha padecido alguna enfermedad importante:',
              bold: true,
              colSpan: 3,
              fillColor: '#53aae0'
            },'','']
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
      const filas = Math.floor(clienteDetalle.patologias.length / 3);
      const residuo = clienteDetalle.patologias.length % 3;
      for( let i = 0; i < filas; i++ ){
        patologias.table.body.push(
          [
            {text: [( clienteDetalle.patologias[i*3].activo ?  '( x ) ': '(    ) ' ) ,{ text: this.capitalizeFirstLetter( clienteDetalle.patologias[i*3].nombre.toLowerCase() ), bold:false}],bold: true},
            {text: [( clienteDetalle.patologias[i*3+1].activo ?  '( x ) ': '(    ) ' ) ,{ text: this.capitalizeFirstLetter( clienteDetalle.patologias[i*3+1].nombre.toLowerCase() ), bold:false}],bold:true},
            {text: [( clienteDetalle.patologias[i*3+2].activo ?  '( x ) ': '(    ) ' ) ,{text: this.capitalizeFirstLetter( clienteDetalle.patologias[i*3+2].nombre.toLowerCase() ), bold:false}], bold:true}]
        )
      }
      if(residuo){
        patologias.table.body.push(
          [
            {text : (filas*3) < clienteDetalle.patologias.length ? [( clienteDetalle.patologias[filas*3].activo ?  '( x ) ': '(    ) ' ) , {text:  this.capitalizeFirstLetter( clienteDetalle.patologias[filas*3].nombre.toLowerCase() ), bold: false}] : '', bold: true},
            {text: (filas*3+1) < clienteDetalle.patologias.length ? [( clienteDetalle.patologias[filas*3+1].activo ?  '( x ) ': '(    ) ' ) , {text: this.capitalizeFirstLetter( clienteDetalle.patologias[filas*3+1].nombre.toLowerCase() ), bold: true}] : '', bold: true},
            {text: (filas*3+2) < clienteDetalle.patologias.length ? [( clienteDetalle.patologias[filas*3+2].activo ?  ' ( x )': ' (    )' ) , {text: this.capitalizeFirstLetter( clienteDetalle.patologias[filas*3+2].nombre.toLowerCase() ), bold: true}] : '', bold: true}
          ]
        )
      }
      content.push(patologias);

      /** Tiene medicación  **/
      content.push({
        margin: [0,0,0,5],
        table: {
          widths: ['*', 'auto', 'auto'],
          body: [
            [{text: 'Esta tomando algún tipo de medicamento:',
              bold: true,
              fillColor: '#53aae0'
            }, {text:['SI ',{text: clienteDetalle.tieneMedicacion ? '( x )' : '(    )', bold: true}]},{text:['NO ',{text: !clienteDetalle.tieneMedicacion ? '( x )' : '(    )', bold: true}]}],
            [{text: ['Cual: ',
                {text:clienteDetalle.tieneMedicacion ? clienteDetalle.indiqueMedicacion : 'Ninguno'}
            ],bold: false,
              colSpan: 3}, '','']
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

      const antecedentes = clienteDetalle.antecedenteFamiliar ? clienteDetalle.antecedenteFamiliar.split(',').map( x => parseInt(x,10)) : [];
      /** Antecedentes familiares enfermedades **/
      content.push({
        margin: [0,0,0,5],
        table: {
          widths: ['*', '*', '*'],
          body: [
            [{text: 'En su familia hay antecedentes de enfermedades:',
              bold: true,
              colSpan: 3,
              fillColor: '#53aae0'
            },'',''],
            [{text: [
                'Alérgica ',
                {text: antecedentes.includes(1) ? '( x )' : '(    )', bold:true}],
              bold: false,
            }, {text: [
                'De la coagulación ',
                {text: antecedentes.includes(2) ? '( x )' : '(    )', bold:true}],
              bold: false,
            },{text: [
                'Cardiacas ',
                {text: antecedentes.includes(3) ? '( x )' : '(    )', bold:true}],
              bold: false,
            }],
            [{text: [
                'Diabetes ',
                {text: antecedentes.includes(4) ? '( x )' : '(    )', bold:true}],
              bold: false,
            }, {text: [
                'Presión Alta ',
                {text: antecedentes.includes(5) ? '( x )' : '(    )', bold:true}],
              bold: false,
            },{text: [
                'N.A ',
                {text: antecedentes.includes(0) ? '( x )' : '(    )', bold:true}],
              bold: false,
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
        },
        //pageBreak: 'after'
      });

      /** Esta embazarada **/
      content.push({
        margin: [0,0,0,5],
        table: {
          widths: ['*', 'auto', 'auto'],
          body: [
            [{text: 'Tiene embarazo o sospecha de embarazo:',
              bold: true,
              fillColor: '#53aae0'
            }, {text:['SI ',{text: clienteDetalle.embarazoSospecha === 1 ? '( x )' :'(    )', bold: true}]},{text:['NO ',{text: clienteDetalle.embarazoSospecha === 0 ? '( x )' : '(    )', bold: true}]}]
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

      /** Tipo de cicatrización **/
      content.push({
        margin: [0,0,0,5],
        table: {
          widths: ['*', '*', '*','*'],
          body: [
            [{text: 'Su cicatrización es:',
              bold: true,
              colSpan: 4,
              fillColor: '#53aae0'
            },'',''], TipoCicatrizacion.map(t => {
              return {text: [
                  t.value + ' ',
                  {text: t.index === clienteDetalle.tipoCicatrizacion ? '( x )' : '(    )', bold:true}],
                bold: false,
              }
            })
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


      const reacciones = clienteDetalle.reaccionAlergicaCutanea ? clienteDetalle.reaccionAlergicaCutanea.split(',').map( x => parseInt(x,10)) : [];
      /** Reacción alergica cutanea **/
      content.push({
        margin: [0,0,0,5],
        table: {
          widths: ['*', '*', '*','*'],
          body: [
            [{text: 'Ha sufrido alguna reacción alérgica cutánea al:',
              bold: true,
              colSpan: 4,
              fillColor: '#53aae0'
            },'',''],
            ReaccionAlergicaCutanea.map( (r,i) => {
              return {text: [
                  r.value + ' ',
                  {text: reacciones.includes(r.index) ? '( x )':'(    )', bold:true}],
                bold: false
              };
            })
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

      /** Es fumador **/
      content.push({
        margin: [0,0,0,5],
        table: {
          widths: ['*', 'auto', 'auto'],
          body: [
            [{text: 'Fuma:',
              bold: true,
              fillColor: '#53aae0'
            },
              {text:['SI ',{text:clienteDetalle.esFumador ? '( x )' : '(    )', bold: true}]},
              {text:['NO ', {text: !clienteDetalle.esFumador ? '( x )' : '(    )', bold: true}]}],
            [{text: ['Cuántos cigarros al día: ', {text: clienteDetalle.cigarrosAldia},
            ], bold: false,
              colSpan: 3}, '','']
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

      /** Bebe alcohol **/
      content.push({
        margin: [0,0,0,5],
        table: {
          widths: ['*', '*', '*'],
          body: [
            [{text: 'Bebe Alcohol:',
              bold: true,
              colSpan: 3,
              fillColor: '#53aae0'
            },'',''],
            BebeAlcohol.map( b => {
              return {text: [
                  b.value + ' ',
                  {text: b.index === clienteDetalle.bebeAlcohol ? '( x )' : '(    )', bold:true}],
                bold: false,
              }
            })
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

      /** Medio de comunicación **/
      content.push({
        margin: [0,0,0,5],
        table: {
          widths: ['*', '*', '*'],
          body: [
            [{text: 'Como prefiere que nos comuniquemos con usted:',
              bold: true,
              colSpan: 3,
              fillColor: '#53aae0'
            },'',''],
            MedioComunicacionCliente.map( m => {
              return {text: [
                  m.value + ' ',
                  {text: clienteDetalle.comunicacionCliente === m.index ? '( x )' : '(    )', bold:true}],
                bold: false,
              }
            })
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

      /** Por donde se entero de depilzone **/
      const dondeSeEntero = {
        margin: [0,0,0,5],
        table: {
          widths: ['*'],
          body: [
            [{text: 'Por qué medio te enteraste de DepilZone:',bold: true, fillColor: '#53aae0'}]
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
      }

      const mediosContacto: any = MedioContacto.map( (m,i) => {
        return [{text: [
            m.index === clienteDetalle.idMedioContacto ? '( x ) ' : '(    ) ',
            {text: m.value, bold:false}],
          bold: true,
          border: [true,false,true, (i == MedioContacto.length-1)]
        }];
      })
      dondeSeEntero.table.body = dondeSeEntero.table.body.concat(mediosContacto);
      content.push(dondeSeEntero);

      /** Zonas consultar **/
      const zonasConsultar = {
        margin: [0,0,0,5],
        table: {
          widths: ['*'],
          body: [
            [{text: 'Zonas a consultar:',bold: true, fillColor: '#53aae0'}],
            clienteDetalle.zonasConsultar.map( x => {
              return {
                text: x.nombre
              }
            })
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

      /** Observaciones **/
      content.push({
        margin: [0,0,0,5],
        table: {
          widths: ['*'],
          body: [
            [{text: 'Observaciones:',bold: true, fillColor: '#53aae0'}],
            [{text: clienteDetalle.observaciones,bold: false}]
          ]
        },
        layout: {
          hLineWidth: function (i, node) {
            return 0.5;
          },
          vLineWidth: function (i, node) {
            return 0.5;
          }
        },
        //pageBreak: 'after'
      })

      observer.next(content);

      // When the consumer unsubscribes, clean up data ready for next subscription.
      return {
        unsubscribe(){
        }
      };
    });
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

}
