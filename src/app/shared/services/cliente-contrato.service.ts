import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Page} from "../models/page";
import {DocumentoPlantilla} from "../models/documento";

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {from, Observable, of, throwError} from "rxjs";
import {environment} from "../../../environments/environment";
import {ClienteContrato} from "../models/cliente-contrato";
import {catchError, map, switchMap} from "rxjs/operators";
import {ErrorSistema} from "../models/error-sistema";
import {Meses} from "../enumeracion/enums";
import { formatDate } from '@angular/common';
import { NestjsUploadFilesService, ISendDocument, DocumentosRenderizado, ETypeDocument } from './nestjs-upload-files.service';
import { ClienteService } from './cliente.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;



@Injectable({ providedIn: 'root' })
export class ClienteContratoService {

    headers: HttpHeaders;
    contratoBase64: string | null = null;

    constructor(
        private http: HttpClient,
        private clientService: ClienteService,
        private nestjsUploadFilesService: NestjsUploadFilesService // Inyecta el servicio aquí
    ) {
      this.headers = new HttpHeaders({
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
      });
    }

    grabarContrato(contrato: ClienteContrato, pdf64: string): Observable<any> {
      const oContrato = contrato;
      oContrato.contrato = pdf64;
      return this.http.post<any>(`${environment.apiUrl}/api/clienteContrato`, oContrato, {headers: this.headers});
    }

    async sendContractAsyncAwait(contrato: ClienteContrato): Promise< boolean | ErrorSistema> {
      const customerProfile = await this.clientService.obtenerById(contrato.idCliente).toPromise();
      const email = customerProfile?.correo;
      if (!email) {
        throw new Error('Correo electrónico del cliente no encontrado');
      }
      const data: ISendDocument = {
          documentosRenderizados: contrato.documentosRenderizados.map((doc: any) => {
            return {
              id_contrato: doc.id || 'Documento',
              titulo: doc.titulo, 
              parametros: doc.parametros
            };
          }),
          id_resumen_contratos: contrato.id,
          idEstado: contrato.idEstado,
          idCliente: contrato.idCliente,
          correo_cliente: email,
          type_document: ETypeDocument.Contract
      };

      const res = await this.nestjsUploadFilesService.sendDocumentFile(data);

      if (!res.emailSent) {
        const error = new ErrorSistema();
        error.status = 500;
        error.message = 'No se pudo enviar el correo electrónico con el contrato.';
        return error;
      } else {
        return true;
      }
    }


    enviarContrato(contrato: ClienteContrato): Observable<boolean | ErrorSistema> {
      return from(this.sendContractAsyncAwait(contrato)).pipe(
        switchMap((result) => {
          if (typeof result === 'boolean') {
            return of(result);
          } else {
            return throwError(() => result);
          }
        }),
        catchError((err) => {
          return throwError(() => err);
        })
      );
    }

    anular(contrato: ClienteContrato): Observable<any> {
      return this.http.put<any>(`${environment.apiUrl}/api/clienteContrato/anular`, contrato, {headers: this.headers}).pipe(
        map(res => {

          return res;

        }), catchError( err => {

          return throwError(err);

        })
      );
    }

    buscar(contrato: ClienteContrato): Observable<ClienteContrato | ErrorSistema> {
      return this.http.get<any>(`${environment.apiUrl}/api/clienteContrato/${contrato.id}`, {headers: this.headers}).pipe(
        map(res => {

          if(res.status === 200){
            const contrato = new ClienteContrato();

            contrato.id = res.data.id;
            contrato.nombreCliente = res.data.nombreCliente;
            contrato.tipoDocumentoIdentidad = res.data.tipoDocumentoIdentidad;
            contrato.documentoIdentidad = res.data.documentoIdentidad;
            contrato.documentos = res.data.documentos;
            contrato.fechaRegistro = new Date(res.data.fechaRegistro);
            contrato.idEstado = res.data.idEstado;
            contrato.observacion = res.data.observacion;

            return contrato;
          }else{
            const error = new ErrorSistema();
            error.message = res.message;
            error.status = res.status;
            return error;
          }

        }), catchError( err => {

          return throwError(err);

        })
      );
    }

    listarByCliente(idCliente: number): Observable<ClienteContrato[]> {
      return this.http.get<any>(`${environment.apiUrl}/api/clienteContrato/cliente/${idCliente}`,{headers: this.headers}).pipe(
          map( res => {
            const contratos: ClienteContrato[] = [];

            res.data.forEach( d => {

              const contrato = new ClienteContrato();
              contrato.id = d.id;
              contrato.idCliente = d.idCliente;
              contrato.idDocumentos = d.idDocumentos;
              contrato.fechaRegistro = new Date(d.fechaRegistro);
              contrato.fechaModifico = d.fechaModifico ? new Date(d.fechaModifico) : null;
              contrato.usuarioRegistro = d.usuarioRegistro;
              contrato.usuarioModifico = d.usuarioModifico ? d.usuarioModifico : null;
              contrato.idEstado = d.idEstado;
              contrato.emailEnviado = d.emailEnviado;
              contrato.observacion = d.observacion;
              contrato.listaDocumentos = d.listaDocumentos;

              contratos.push(contrato);

            });

            return contratos;

          }), catchError( err => {

          return throwError(err);

        })
      );
    }

  listarByClientePorServicio(idCliente: number, idServicio: number): Observable<ClienteContrato[]> {
    return this.http.get<any>(`${environment.apiUrl}/api/clienteContrato/cliente/${idCliente}/servicio/${idServicio}`,{headers: this.headers}).pipe(
      map( res => {
        const contratos: ClienteContrato[] = [];

        res.data.forEach( d => {

          const contrato = new ClienteContrato();
          contrato.id = d.id;
          contrato.idCliente = d.idCliente;
          contrato.idDocumentos = d.idDocumentos;
          contrato.fechaRegistro = new Date(d.fechaRegistro);
          contrato.fechaModifico = d.fechaModifico ? new Date(d.fechaModifico) : null;
          contrato.usuarioRegistro = d.usuarioRegistro;
          contrato.usuarioModifico = d.usuarioModifico ? d.usuarioModifico : null;
          contrato.idEstado = d.idEstado;
          contrato.emailEnviado = d.emailEnviado;
          contrato.observacion = d.observacion;
          contrato.listaDocumentos = d.listaDocumentos;
          contrato.confirmado = d.confirmado;
          contrato.fechaConfirmo = d.fechaConfirmo ? new Date(d.fechaConfirmo) : null;

          contratos.push(contrato);

        });

        return contratos;

      }), catchError( err => {

        return throwError(err);

      })
    );
  }

    exportarEvolucionTratamientoPdf(plantilla: DocumentoPlantilla, view: boolean = false): Observable<any>{


      return new Observable((observer) => {

        const page = new Page();
        page.pageMargins = [40,160,40,50];
        page.header = {
          image: plantilla.header,
          width: 595,
          height: 160,
          alignment: "center",
        };
        page.footer = {
          image: plantilla.footer,
          width: 595,
          height: 35,
          alignment: "center",
          margin: [0,15,0,0]
        };
        page.defaultStyle = {

        };
        page.styles = {

        };
        //console.log(JSON.parse(plantilla.plantilla));
        page.content = JSON.parse(plantilla.plantilla);

        const docPdf = pdfMake.createPdf(page);
        observer.next(docPdf);

        // When the consumer unsubscribes, clean up data ready for next subscription.
        return {
          unsubscribe(){
          }
        };
      });
    }

    generarResumenContratoPdf(plantilla: DocumentoPlantilla, contrato: ClienteContrato, defaultStyle: {} = {} , view: boolean = false): Observable<any>{
      // console.log(contrato);
      return new Observable((observer) => {

        const page = new Page();
        page.pageMargins = [40,160,40,50];
        page.header = {
          image: plantilla.header,
          width: 595,
          height: 160,
          alignment: "center",
        };
        page.footer = {
          image: plantilla.footer,
          width: 595,
          height: 35,
          alignment: "center",
          margin: [0,15,0,0]
        };
        page.defaultStyle = defaultStyle;
        page.styles = {

        };

        let _plantilla: any = plantilla.plantilla;

        //console.log(contrato.observacion);
        //return;


        if(_plantilla.includes('@cliente')){
          _plantilla = _plantilla.replaceAll('@cliente', contrato.nombreCliente );
        }
        if(_plantilla.includes('@tipoDocumento')){
          _plantilla = _plantilla.replaceAll('@tipoDocumento', contrato.tipoDocumentoIdentidad ? contrato.tipoDocumentoIdentidad : '' );
        }
        if(_plantilla.includes('@numeroDocumento')){
          _plantilla = _plantilla.replaceAll('@numeroDocumento', contrato.documentoIdentidad ? contrato.documentoIdentidad : '' );
        }
        if(_plantilla.includes('@observacion')){
          _plantilla = _plantilla.replaceAll('@observacion', contrato.observacion ? contrato.observacion.replace(/\n/g, "\\n") : '' );
        }
        if(_plantilla.includes('@dia')){
          _plantilla = _plantilla.replaceAll('@dia', formatDate(new Date(contrato.fechaRegistro),'dd','en' ) );
        }
        if(_plantilla.includes('@mes')){
          _plantilla = _plantilla.replaceAll('@mes', Meses[parseInt(formatDate(new Date(contrato.fechaRegistro),'MM','en' ))] );
        }
        if(_plantilla.includes('@año')){
          _plantilla = _plantilla.replaceAll('@año', formatDate(new Date(contrato.fechaRegistro),'yyyy','en' ) );
        }


        // lista
        const _list = {
          ul: [],
          margin: [ 0, 0, 0, 5 ]
        };


        contrato.documentos.forEach((d, i) => {
          _list.ul.push('D-' + d.id.toString().padStart(8,'0') + '     ' + d.nombre + (d.promocion ? `  ( ${d.promocion} )` : '') + (d.zonas ? ` \n En las zonas:  ${d.zonas}` : '') )
        });

        _plantilla = JSON.parse(_plantilla);
        _plantilla.forEach( (line, index) => {
          if(JSON.stringify(line).includes('@documentos')){
            _plantilla[index] = _list;
          }
        });

        //console.log(JSON.parse(plantilla.plantilla));
        page.content = _plantilla;
        if(!contrato.idEstado){
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

}
