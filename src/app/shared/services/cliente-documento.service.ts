import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {from, Observable, throwError} from 'rxjs';
import { environment } from '../../../environments/environment';
import {catchError, map, switchMap} from "rxjs/operators";
import {DC_Patologia, DC_Zona, Documento, DocumentoCLiente, DocumentoPlantilla, DocumentoTipoPerfil} from '../models/documento';
import {ErrorSistema, OkSistema} from "../models/error-sistema";
import {Meses} from "../enumeracion/enums";
import {UtilsService} from "./funciones/utils.service";
import {DatePipe} from "@angular/common";
import { DocumentosRenderizado, ETypeDocument, ISendDocument, NestjsUploadFilesService } from './nestjs-upload-files.service';
import { ClienteService } from './cliente.service';
@Injectable({ providedIn: 'root' })
export class ClienteDocumentoService {

    headers: HttpHeaders;

    constructor(
        private http: HttpClient,
        private utilService: UtilsService,
        private datePipe: DatePipe,
        private nestjsUploadFilesService: NestjsUploadFilesService,
        private clientService: ClienteService

    ) {
      this.headers = new HttpHeaders({
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
      });
    }


    createDocument( clienteDocumento: DocumentoCLiente ): Observable<DocumentoCLiente | ErrorSistema> {
      // Anula el documento seleccionado
      return this.http.post<any>(`${environment.apiUrl}/api/clienteDocumento`, clienteDocumento, {headers: this.headers}).pipe(
        map((res) => {
          if(res.status !== 201){
            const error = new ErrorSistema();
            error.message = res.message;
            error.status = res.status;
            return error;
          }else{
            const d = res.data;
            const Documento = new DocumentoCLiente();

            Documento.id  = d.id;
            Documento.idCliente = d.idCliente;
            Documento.idDocumentoTipo = d.idDocumentoTipo;
            Documento.nombreDocumento = d.nombreDocumento;
            Documento.idPromocion = d.idPromocion;
            Documento.idZonas = d.idZonas;
            Documento.idPatologia = d.idPatologia;
            Documento.numeroSesiones = d.numeroSesiones;
            Documento.numeroSesionesRetroceder = d.numeroSesionesRetroceder;
            Documento.sesionesAdicionales = d.sesionesAdicionales;
            Documento.intervaloMantenimiento = d.intervaloMantenimiento;
            Documento.consultaMantenimientoEn = d.consultaMantenimientoEn;
            Documento.descripcionComentario = d.descripcionComentario;
            Documento.idDoctora = d.idDoctora;
            Documento.idEstado = d.idEstado;
            Documento.observacion = d.observacion;
            Documento.fechaRegistra = d.fechaRegistra ? new Date(d.fechaRegistra) : null ;
            Documento.usuarioRegistro = d.usuarioRegistro;
            Documento.documento = d.documento;
            Documento.motivoAnulacion = d.motivoAnulacion;
            Documento.dniApoderado = d.dniApoderado;
            Documento.nombreApoderado = d.nombreApoderado;
            Documento.version = d.version;
            Documento.fechaNacimiento = d.fechaNacimiento ? new Date(d.fechaNacimiento) : null ;

            Documento.nombreCliente = d.nombreCliente;
            Documento.nombreDoctora = d.nombreDoctora;
            Documento.tipoDocumentoIdentidad = d.tipoDocumentoIdentidad;
            Documento.documentoIdentidad = d.documentoIdentidad;
            Documento.direccion = d.direccion;
            Documento.distrito = d.distrito;
            Documento.fechaDocumento = d.fechaDocumento;
            Documento.mensajeAviso = d.mensaje;
            Documento.plantilla = d.plantilla;
            Documento.condiciones = d.condiciones;

            if(d.zonas){
              const zonas: DC_Zona[] = [];

              d.zonas.forEach( z => {
                const zona  = new DC_Zona();
                zona.id = z.id;
                zona.nombre = z.nombre;
                zonas.push(zona);
              });

              Documento.zonas = zonas;
            }

            if(d.patologias){
              const patologias: DC_Patologia[] = [];
              d.patologias.forEach( p => {
                const patologia = new DC_Patologia();
                patologia.id = p.id;
                patologia.nombre = p.nombre;
                patologias.push(patologia);
              });

              Documento.patologias = patologias;
            }

            return Documento;
          }

        }), catchError((err) => {
          return throwError(err);
        })
      );
    }

    cancelDocument( id: number, documento: DocumentoCLiente ): Observable<DocumentoCLiente | ErrorSistema> {
      // Anula el documento seleccionado
      return this.http.put<any>(`${environment.apiUrl}/api/clienteDocumento/${id}/anular`, documento, {headers: this.headers}).pipe(
        map((res) => {
          if(res.status !== 200){
            const error = new ErrorSistema();
            error.message = res.message;
            error.status = res.status;
            return error;
          }
          else{
            const d = res.data;
            const ODoc = new DocumentoCLiente();

            ODoc.id = d.id;
            ODoc.idCliente = d.idCliente;
            ODoc.nombreDocumento = d.nombreDocumento;
            ODoc.promocion = d.promocion;
            ODoc.idPromocion =  d.idPromocion;
            ODoc.idZonas = d.idZonas;

            return ODoc;
          }
        }), catchError((err) => {
          return throwError(err);
        })
      );
    }

    restoreDocument( id: number, documento: DocumentoCLiente ): Observable<DocumentoCLiente | ErrorSistema> {
      // Anula el documento seleccionado
      return this.http.put<any>(`${environment.apiUrl}/api/clienteDocumento/${id}/restaurar`, documento,{headers: this.headers}).pipe(
        map((res) => {
          if(res.status !== 200){
            const error = new ErrorSistema();
            error.message = res.message;
            error.status = res.status;
            return error;
          }
          else{
            const d = res.data;
            const ODoc = new DocumentoCLiente();

            ODoc.id = d.id;
            ODoc.idCliente = d.idCliente;
            ODoc.nombreDocumento = d.nombreDocumento;
            ODoc.promocion = d.promocion;
            ODoc.idPromocion =  d.idPromocion;
            ODoc.idZonas = d.idZonas;

            return ODoc;
          }
        }), catchError((err) => {
          return throwError(err);
        })
      );
    }

    sendDocument(documentoCliente: DocumentoCLiente): Observable<OkSistema | ErrorSistema> {
      return from(this.sendDocumentAsyncAwait(documentoCliente)).pipe(
        switchMap((result) => {
          if (result instanceof OkSistema) {
            return [result];
          } else {
            return throwError(() => result);
          }
        }),
        catchError((err) => {
          return throwError(() => err);
        })
      );
    }

  async sendDocumentAsyncAwait(documentoCliente: DocumentoCLiente): Promise<OkSistema | ErrorSistema> {
      try {
        const documentosRenderizados: DocumentosRenderizado[] = [
          {
            id_contrato: documentoCliente.id,
            titulo: documentoCliente.nombreDocumento || documentoCliente.titulo || 'Documento',
            parametros: documentoCliente.parametros
          }
        ];

        const customerProfile = await this.clientService.obtenerById(documentoCliente.idCliente).toPromise();
        const email = customerProfile?.correo;
        if (!email) {
          throw new Error('Correo electrónico del cliente no encontrado');
        }

        const data: ISendDocument = {
          documentosRenderizados,
          id_resumen_contratos: documentoCliente.id,
          idEstado: documentoCliente.idEstado,
          idCliente: documentoCliente.idCliente,
          correo_cliente: email,
          type_document: ETypeDocument.General
        };
        const res = await this.nestjsUploadFilesService.sendDocumentFile(data);

        if (res.emailSent === true) {
          const ok = new OkSistema();
          ok.message = 'Documento enviado correctamente';
          ok.status = 200;
          return ok;
        } else {
          const error = new ErrorSistema();
          error.message = 'Error al enviar el documento!';
          error.status = 500;
          return error;
        }
      } catch (err) {
        console.error('Error al enviar el documento:', err);
        const error = new ErrorSistema();
        error.message = 'Error al enviar el documento: ' + (err instanceof Error ? err.message : 'Error desconocido');
        error.status = 500;
        return error;
      }
    }

    getDocumentById( id: number ): Observable<DocumentoCLiente | ErrorSistema> {
      // Anula el documento seleccionado
      return this.http.get<any>(`${environment.apiUrl}/api/clienteDocumento/${id}`, {headers: this.headers}).pipe(
        map((res) => {
          //console.log('documento', res);
          if(res.status === 200){
            const d = res.data;
            const Documento = new DocumentoCLiente();

            Documento.id  = d.id;
            Documento.idCliente = d.idCliente;
            Documento.condiciones = d.condiciones;
            Documento.idDocumentoTipo = d.idDocumentoTipo;
            Documento.nombreDocumento = d.nombreDocumento;
            Documento.idPromocion = d.idPromocion;
            Documento.idZonas = d.idsZonas;
            Documento.idPatologia = d.idPatologia;
            Documento.numeroSesiones = d.numeroSesiones;
            Documento.numeroSesionesRetroceder = d.numeroSesionesRetroceder;
            Documento.sesionesAdicionales = d.sesionesAdicionales;
            Documento.intervaloMantenimiento = d.intervaloMantenimiento;
            Documento.consultaMantenimientoEn = d.consultaMantenimientoEn;
            Documento.descripcionComentario = d.descripcionComentario;
            Documento.idDoctora = d.idDoctora;
            Documento.idEstado = d.idEstado;
            Documento.observacion = d.observacion;
            Documento.fechaRegistra = d.fechaRegistra ? new Date(d.fechaRegistra) : null ;
            Documento.usuarioRegistro = d.usuarioRegistro;
            Documento.documento = d.documento;
            Documento.motivoAnulacion = d.motivoAnulacion;
            Documento.dniApoderado = d.dniApoderado;
            Documento.nombreApoderado = d.nombreApoderado;
            Documento.version = d.version;
            Documento.fechaNacimiento = d.fechaNacimiento ? new Date(d.fechaNacimiento) : null ;

            Documento.nombreCliente = d.nombreCliente;
            Documento.nombreDoctora = d.nombreDoctora;
            Documento.tipoDocumentoIdentidad = d.tipoDocumentoIdentidad;
            Documento.documentoIdentidad = d.documentoIdentidad;
            Documento.direccion = d.direccion;
            Documento.distrito = d.distrito;
            Documento.fechaDocumento = d.fechaDocumento;
            Documento.plantilla = d.plantilla;

            if(d.zonas){
              const zonas: DC_Zona[] = [];

              d.zonas.forEach( z => {
                const zona  = new DC_Zona();
                zona.id = z.id;
                zona.nombre = z.nombre;
                zonas.push(zona);
              });

              Documento.zonas = zonas;
            }

            if(d.patologias){
              const patologias: DC_Patologia[] = [];
              d.patologias.forEach( p => {
                const patologia = new DC_Patologia();
                patologia.id = p.id;
                patologia.nombre = p.nombre;
                patologias.push(patologia);
              });

              Documento.patologias = patologias;
            }

            return Documento;
          }else{
            const error = new ErrorSistema();
            error.message = res.message;
            error.status = res.status;
            return error;
          }
        }), catchError((err) => {
          return throwError(err);
        })
      );
    }

    getCollection(): Observable<DocumentoCLiente[]> {
      // Anula el documento seleccionado
      return this.http.get<any>(`${environment.apiUrl}/api/clienteDocumento`, {headers: this.headers}).pipe(
        map((res) => {
          const collection: DocumentoCLiente[] = [];


          const data = res.data;

          data.forEach( d => {

            const Documento = new DocumentoCLiente();

            Documento.id  = d.id;
            Documento.idCliente = d.idCliente;
            Documento.idDocumentoTipo = d.idDocumentoTipo;
            Documento.nombreDocumento = d.nombreDocumento;
            Documento.idPromocion = d.idPromocion;
            Documento.idZonas = d.idZonas;
            Documento.idPatologia = d.idPatologia;
            Documento.numeroSesiones = d.numeroSesiones;
            Documento.numeroSesionesRetroceder = d.numeroSesionesRetroceder;
            Documento.sesionesAdicionales = d.sesionesAdicionales;
            Documento.intervaloMantenimiento = d.intervaloMantenimiento;
            Documento.consultaMantenimientoEn = d.consultaMantenimientoEn;
            Documento.descripcionComentario = d.descripcionComentario;
            Documento.idDoctora = d.idDoctora;
            Documento.idEstado = d.idEstado;
            Documento.observacion = d.observacion;
            Documento.fechaRegistra = d.fechaRegistra ? new Date(d.fechaRegistra) : null ;
            Documento.usuarioRegistro = d.usuarioRegistro;
            Documento.documento = d.documento;
            Documento.motivoAnulacion = d.motivoAnulacion;
            Documento.dniApoderado = d.dniApoderado;
            Documento.nombreApoderado = d.nombreApoderado;
            Documento.version = d.version;
            Documento.fechaNacimiento = d.fechaNacimiento ? new Date(d.fechaNacimiento) : null ;

            Documento.nombreCliente = d.nombreCliente;
            Documento.nombreDoctora = d.nombreDoctora;
            Documento.tipoDocumentoIdentidad = d.tipoDocumentoIdentidad;
            Documento.documentoIdentidad = d.documentoIdentidad;
            Documento.direccion = d.direccion;
            Documento.distrito = d.distrito;
            Documento.fechaDocumento = d.fechaDocumento;

            Documento.promocion = d.promocion;

            if(d.zonas){
              const zonas: DC_Zona[] = [];

              d.zonas.forEach( z => {
                const zona  = new DC_Zona();
                zona.id = z.id;
                zona.nombre = z.nombre;
                zonas.push(zona);
              });

              Documento.zonas = zonas;
            }

            collection.push(Documento);

          });



          return collection;
        }), catchError((err) => {
          return throwError(err);
        })
      );
    }

    collectionByClient( idCliente: number): Observable<DocumentoCLiente[] | ErrorSistema> {
      // Retorna un arreglo de clase Documento, de acuerdo al cliente
      return this.http.get<any>(`${environment.apiUrl}/api/clienteDocumento/cliente/${idCliente}`, {headers: this.headers}).pipe(
        map((res)=>{
          if(res.status === 200){
            const documentos: DocumentoCLiente[] = [];
            res.data.forEach((doc) => {
              const ODoc = new DocumentoCLiente();
              ODoc.id = doc.id;
              ODoc.idCliente = doc.idCliente;
              ODoc.promocion = doc.documentoPromocion;
              ODoc.idZonas = doc.idsZonas;
              ODoc.titulo = doc.TituloDocumento;
              ODoc.nombreDocumento = doc.nombreDocumento;
              ODoc.fechaRegistra = new Date(doc.fechaRegistra);
              ODoc.idEstado = doc.idEstado;
              ODoc.usuarioRegistro = doc.usuarioRegistro;
              ODoc.emailEnviado = doc.emailEnviado;
              ODoc.listaZonas = doc.listaZonas;

              documentos.push(ODoc);
            });
            return documentos;
          }else{
            const error = new ErrorSistema();
            error.message = res.message;
            error.status = res.status;
            return error;
          }

        }),catchError((err)=>{
          return throwError(err);
        })
      );
    }

  collectionByClientByService( idCliente: number, idServicio: number): Observable<DocumentoCLiente[] | ErrorSistema> {
    // Retorna un arreglo de clase Documento, de acuerdo al cliente
    return this.http.get<any>(`${environment.apiUrl}/api/clienteDocumento/cliente/${idCliente}/servicio/${idServicio}`, {headers: this.headers}).pipe(
      map((res)=>{
        if(res.status === 200){
          const documentos: DocumentoCLiente[] = [];
          res.data.forEach((doc) => {
            const ODoc = new DocumentoCLiente();
            ODoc.id = doc.id;
            ODoc.idCliente = doc.idCliente;
            ODoc.promocion = doc.documentoPromocion;
            ODoc.idZonas = doc.idsZonas;
            ODoc.titulo = doc.TituloDocumento;
            ODoc.nombreDocumento = doc.nombreDocumento;
            ODoc.fechaRegistra = new Date(doc.fechaRegistra);
            ODoc.idEstado = doc.idEstado;
            ODoc.usuarioRegistro = doc.usuarioRegistro;
            ODoc.emailEnviado = doc.emailEnviado;
            ODoc.listaZonas = doc.listaZonas;
            ODoc.confirmado = doc.confirmado;
            ODoc.fechaConfirmo = doc.fechaConfirmo ? new Date(doc.fechaConfirmo) : null;

            documentos.push(ODoc);
          });
          return documentos;
        }else{
          const error = new ErrorSistema();
          error.message = res.message;
          error.status = res.status;
          return error;
        }

      }),catchError((err)=>{
        return throwError(err);
      })
    );
  }

    collectionByClientByFecha( idCliente: number, fecha: string): Observable<DocumentoCLiente[] | ErrorSistema> {
      // Retorna un arreglo de clase Documento, de acuerdo al cliente
      return this.http.get<any>(`${environment.apiUrl}/api/clienteDocumento/cliente/${idCliente}/${fecha}`, {headers: this.headers}).pipe(
        map((res)=>{
          if(res.status === 200){
            const documentos: DocumentoCLiente[] = [];
            res.data.forEach((doc) => {
              const ODoc = new DocumentoCLiente();
              ODoc.id = doc.id;
              ODoc.idCliente = doc.idCliente;
              ODoc.promocion = doc.documentoPromocion;
              ODoc.idZonas = doc.idsZonas;
              ODoc.titulo = doc.TituloDocumento;
              ODoc.nombreDocumento = doc.nombreDocumento;
              ODoc.fechaRegistra = new Date(doc.fechaRegistra);
              ODoc.idEstado = doc.idEstado;
              ODoc.usuarioRegistro = doc.usuarioRegistro;
              ODoc.emailEnviado = doc.emailEnviado;

              documentos.push(ODoc);
            });
            return documentos;
          }else{
            const error = new ErrorSistema();
            error.message = res.message;
            error.status = res.status;
            return error;
          }

        }),catchError((err)=>{
          return throwError(err);
        })
      );
    }

    collectionByClientByFechaPorServicio( idCliente: number, fecha: string, idServicio: number): Observable<DocumentoCLiente[] | ErrorSistema> {
      // Retorna un arreglo de clase Documento, de acuerdo al cliente
      return this.http.get<any>(`${environment.apiUrl}/api/clienteDocumento/cliente/${idCliente}/${fecha}/${idServicio}`, {headers: this.headers}).pipe(
        map((res)=>{
          if(res.status === 200){
            const documentos: DocumentoCLiente[] = [];
            res.data.forEach((doc) => {
              const ODoc = new DocumentoCLiente();
              ODoc.id = doc.id;
              ODoc.idCliente = doc.idCliente;
              ODoc.promocion = doc.documentoPromocion;
              ODoc.idZonas = doc.idsZonas;
              ODoc.titulo = doc.TituloDocumento;
              ODoc.nombreDocumento = doc.nombreDocumento;
              ODoc.fechaRegistra = new Date(doc.fechaRegistra);
              ODoc.idEstado = doc.idEstado;
              ODoc.usuarioRegistro = doc.usuarioRegistro;
              ODoc.emailEnviado = doc.emailEnviado;

              documentos.push(ODoc);
            });
            return documentos;
          }else{
            const error = new ErrorSistema();
            error.message = res.message;
            error.status = res.status;
            return error;
          }

        }),catchError((err)=>{
          return throwError(err);
        })
      );
    }


    /************************************************* FUNCTIONS *******************************************/

    async drawDocument( clienteDocumento: DocumentoCLiente,maestroPatologia: any[] = [], maestroPromocion: any[] = [], listaPromocionPrecioZonas: any[] | null = null, zonasSeleccionadas:Array<IZoneSelected> = []): Promise<string>{

      let plantilla: any = clienteDocumento.plantilla;

      if(plantilla.includes('@id')){
        plantilla = plantilla.replaceAll('@id', clienteDocumento.id);
      }

      if(plantilla.includes('@cliente')){
        plantilla = plantilla.replaceAll('@cliente', clienteDocumento.nombreCliente);
      }

      if(plantilla.includes('@tipoDocumento')){
        plantilla = plantilla.replaceAll('@tipoDocumento', clienteDocumento.tipoDocumentoIdentidad);
      }

      if(plantilla.includes('@numeroDocumento')){
        plantilla = plantilla.replaceAll('@numeroDocumento', clienteDocumento.documentoIdentidad);
      }

      if(plantilla.includes('@observacion')){
        plantilla = clienteDocumento.observacion ?  plantilla.replaceAll('@observacion', clienteDocumento.observacion.replace(/\n/g, "\\n") ) : plantilla.replaceAll('@observacion', '');
      }

      if(plantilla.includes('@selected_zones')){
        // Si la plantilla es un array (pdfMake), reemplaza el marcador por la tabla
        try {
          let _plantilla = JSON.parse(plantilla);
          _plantilla.forEach((line, index) => {
            if (JSON.stringify(line).includes('@selected_zones')) {
              _plantilla[index] = this.construirTablaZonasSeleccionadas(zonasSeleccionadas);
            }
          });
          plantilla = JSON.stringify(_plantilla);
        } catch {
          // Si la plantilla es string, reemplaza el marcador por texto plano
          plantilla = plantilla.replaceAll('@selected_zones', zonasSeleccionadas.map(z => z.descripcion).join(', '));
        }
      }


      if(plantilla.includes('@zonas')){
        plantilla = plantilla.replaceAll('@zonas', clienteDocumento.zonas.map( z => {
          return z.nombre
        }).join(', ') );
      }

      if(plantilla.includes('@documentoTutor')){
        plantilla = plantilla.replaceAll('@documentoTutor', clienteDocumento.dniApoderado);
      }

      if(plantilla.includes('@nombreTutor')){
        plantilla = plantilla.replaceAll('@nombreTutor', clienteDocumento.nombreApoderado);
      }

      if(plantilla.includes('@edad')){
        plantilla = plantilla.replaceAll('@edad', clienteDocumento.fechaNacimiento ? this.utilService.calculaEdad(new Date(clienteDocumento.fechaNacimiento)).toString() : '' );
      }

      if(plantilla.includes('@diaD')){
        plantilla = plantilla.replaceAll('@diaD', this.datePipe.transform(clienteDocumento.fechaDocumento,'dd'));
      }

      if(plantilla.includes('@mesD')){
        plantilla = plantilla.replaceAll('@mesD', Meses[parseInt( this.datePipe.transform(clienteDocumento.fechaDocumento,'MM') )]);
      }

      if(plantilla.includes('@añoD')){
        plantilla = plantilla.replaceAll('@añoD', this.datePipe.transform(clienteDocumento.fechaDocumento,'yyyy'));
      }

      if(plantilla.includes('@domicilioCliente')){
        plantilla = plantilla.replaceAll('@domicilioCliente', clienteDocumento.direccion);
      }

      if(plantilla.includes('@distritoCliente')){
        plantilla = plantilla.replaceAll('@distritoCliente', clienteDocumento.distrito);
      }

      if(plantilla.includes('@retrocederNsesiones')){
        plantilla = plantilla.replaceAll('@retrocederNsesiones', clienteDocumento.numeroSesionesRetroceder.toString());
      }

      if(plantilla.includes('@terminoNsesiones')){
        plantilla = plantilla.replaceAll('@terminoNsesiones', clienteDocumento.numeroSesiones.toString());
      }

      if(plantilla.includes('@sesionesAdicionales')){
        plantilla = plantilla.replaceAll('@sesionesAdicionales', clienteDocumento.sesionesAdicionales.toString());
      }

      if(plantilla.includes('@intervaloMantenimiento')){
        plantilla = plantilla.replaceAll('@intervaloMantenimiento', clienteDocumento.intervaloMantenimiento > 1 ? clienteDocumento.intervaloMantenimiento + " meses." : clienteDocumento.intervaloMantenimiento + "mes.");
      }

      if(plantilla.includes('@consultaMantenimientoEn')){
        plantilla = plantilla.replaceAll('@consultaMantenimientoEn', clienteDocumento.consultaMantenimientoEn.toString());
      }

      if(plantilla.includes('@distrito') || plantilla.includes('@distritoCliente')){
        plantilla = plantilla.replaceAll('@distrito', clienteDocumento.distrito);
        plantilla = plantilla.replaceAll('@distritoCliente', clienteDocumento.distrito);
      }

      if(plantilla.includes('@direccion') || plantilla.includes('@domicilioCliente')){
        plantilla = plantilla.replaceAll('@direccion', clienteDocumento.direccion);
        plantilla = plantilla.replaceAll('@domicilioCliente', clienteDocumento.direccion);
      }

      if(plantilla.includes('@patologia')){
        const ids = clienteDocumento.idPatologia ? clienteDocumento.idPatologia.split(",").map(x => parseInt(x)) : [];
        const patologias = maestroPatologia.filter( x => ids.includes(x.id)).map( x => x.nombre);
        plantilla = plantilla.replaceAll('@patologia', patologias.join(", "));
      }

      if(plantilla.includes('@condiciones')){
        plantilla = plantilla.replaceAll('@condiciones', clienteDocumento.condiciones);
      }

      if( plantilla.includes('@promocion') && plantilla.includes('@tblzonas') ){
        const promocion = maestroPromocion.find(x => x.idPromocion == clienteDocumento.idPromocion)?.descripcion;
        plantilla = plantilla.replaceAll('@promocion', promocion);

        plantilla = await this.insertarTablaZonasPrecio(plantilla, clienteDocumento, listaPromocionPrecioZonas);
      }

      if(plantilla.includes('@promocion')){
        const promocion = maestroPromocion.find(x => x.idPromocion == clienteDocumento.idPromocion)?.descripcion;
        plantilla = plantilla.replaceAll('@promocion', promocion);
      }

      if(plantilla.includes('@dia')){
        plantilla = plantilla.replaceAll('@dia', this.datePipe.transform(clienteDocumento.fechaRegistra,'dd'));
      }

      if(plantilla.includes('@mes')){
        plantilla = plantilla.replaceAll('@mes', Meses[parseInt(this.datePipe.transform(clienteDocumento.fechaRegistra,'MM'))]);
      }

      if(plantilla.includes('@año')){
        plantilla = plantilla.replaceAll('@año', this.datePipe.transform(clienteDocumento.fechaRegistra,'yyyy'));
      }

      return plantilla;
    }

    async drawDocumentNest( clienteDocumento: DocumentoCLiente,maestroPatologia: any[] = [], maestroPromocion: any[] = [], listaPromocionPrecioZonas: any[] | null = null, zonasSeleccionadas:Array<IZoneSelected> = []): Promise<any>{
      const parametros = {}
      let plantilla: any = clienteDocumento.plantilla;

      if(plantilla.includes('@id')){
        parametros['id'] = clienteDocumento.id;
      }

      if(plantilla.includes('@cliente')){
        parametros['cliente'] = clienteDocumento.nombreCliente;
      }

      if(plantilla.includes('@tipoDocumento')){
        parametros['tipoDocumento'] = clienteDocumento.tipoDocumentoIdentidad;
      }

      if(plantilla.includes('@numeroDocumento')){
        parametros['numeroDocumento'] = +clienteDocumento.documentoIdentidad;
      }

      if(plantilla.includes('@observacion')){
        parametros['observacion'] = clienteDocumento.observacion ? clienteDocumento.observacion.replace(/\n/g, "\\n") : '';
      }

      if(plantilla.includes('@selected_zones')){
        parametros['selected_zones'] = zonasSeleccionadas.map(z => z.descripcion).join(', ');
      }


      if(plantilla.includes('@zonas')){
        parametros['zonas'] = clienteDocumento.zonas.map(z => z.nombre).join(', ');
      }

      if(plantilla.includes('@documentoTutor')){
        parametros['documentoTutor'] = clienteDocumento.dniApoderado;
      }

      if(plantilla.includes('@nombreTutor')){
        parametros['nombreTutor'] = clienteDocumento.nombreApoderado;
      }

      if(plantilla.includes('@edad')){
        parametros['edad'] = clienteDocumento.fechaNacimiento ? this.utilService.calculaEdad(new Date(clienteDocumento.fechaNacimiento)).toString() : '';
      }

      if(plantilla.includes('@diaD')){
        parametros['diaD'] = this.datePipe.transform(clienteDocumento.fechaDocumento,'dd');
      }

      if(plantilla.includes('@mesD')){
        parametros['mesD'] = Meses[parseInt( this.datePipe.transform(clienteDocumento.fechaDocumento,'MM') )];
      }

      if(plantilla.includes('@añoD')){
        parametros['añoD'] = this.datePipe.transform(clienteDocumento.fechaDocumento,'yyyy');
      }

      if(plantilla.includes('@domicilioCliente')){
        parametros['domicilioCliente'] = clienteDocumento.direccion;
      }

      if(plantilla.includes('@distritoCliente')){
        parametros['distritoCliente'] = clienteDocumento.distrito;
      }

      if(plantilla.includes('@retrocederNsesiones')){
        parametros['retrocederNsesiones'] = clienteDocumento.numeroSesionesRetroceder.toString();
      }

      if(plantilla.includes('@terminoNsesiones')){
        parametros['terminoNsesiones'] = clienteDocumento.numeroSesiones.toString();
      }

      if(plantilla.includes('@sesionesAdicionales')){
        parametros['sesionesAdicionales'] = clienteDocumento.sesionesAdicionales.toString();
      }

      if(plantilla.includes('@intervaloMantenimiento')){
        parametros['intervaloMantenimiento'] = clienteDocumento.intervaloMantenimiento > 1 ? clienteDocumento.intervaloMantenimiento + " meses." : clienteDocumento.intervaloMantenimiento + "mes.";
      }

      if(plantilla.includes('@consultaMantenimientoEn')){
        parametros['consultaMantenimientoEn'] = clienteDocumento.consultaMantenimientoEn.toString();
      }

      if(plantilla.includes('@distrito') || plantilla.includes('@distritoCliente')){
        parametros['distrito'] = clienteDocumento.distrito;
        parametros['distritoCliente'] = clienteDocumento.distrito;
      }

      if(plantilla.includes('@direccion') || plantilla.includes('@domicilioCliente')){
        parametros['direccion'] = clienteDocumento.direccion;
        parametros['domicilioCliente'] = clienteDocumento.direccion;

      }

      if(plantilla.includes('@patologia')){
        const ids = clienteDocumento.idPatologia ? clienteDocumento.idPatologia.split(",").map(x => parseInt(x)) : [];
        const patologias = maestroPatologia.filter( x => ids.includes(x.id)).map( x => x.nombre);
        
        parametros['patologia'] = patologias.join(", ");
      }

      if(plantilla.includes('@condiciones')){
        parametros['condiciones'] = clienteDocumento.condiciones;
      }

      if( plantilla.includes('@promocion') && plantilla.includes('@tblzonas') ){
        const promocion = maestroPromocion.find(x => x.idPromocion == clienteDocumento.idPromocion)?.descripcion;
        parametros['promocion'] = promocion;
        parametros['tblzonas'] = promocion;
      }

      if(plantilla.includes('@promocion')){
        const promocion = maestroPromocion.find(x => x.idPromocion == clienteDocumento.idPromocion)?.descripcion;

        parametros['promocion'] = promocion;
      }

      if(plantilla.includes('@dia')){
        parametros['dia'] = +this.datePipe.transform(clienteDocumento?.fechaRegistra, 'dd') || 0;
      }

      if(plantilla.includes('@mes')){
        parametros['mes'] = Meses[parseInt(this.datePipe.transform(clienteDocumento.fechaRegistra,'MM'))];
      }

      if(plantilla.includes('@año')){
        parametros['año'] = +this.datePipe.transform(clienteDocumento.fechaRegistra,'yyyy') || 0;
      }

      return parametros;
    }

    async insertarTablaZonasPrecio( plantilla: string, documentoCliente: DocumentoCLiente, listaPromocionPrecioZonas: any[] ): Promise<string>{

      // console.log(listaPromocionPrecioZonas);

      let output = '';

      // zonas seleccionadas
      const _idZonas = documentoCliente.zonas.map( z => z.id);
      //  promoción seleccionada
      const _idPromocion = documentoCliente.idPromocion;
      // tabla a insertar
      const _tabla: any = {
        table: {
          widths: ['auto', '*'],
          headerRows: 1,
          // keepWithHeaderRows: 1,
          body: [
              [
              {text: 'ITEM', alignment: 'center center', style: 'tableHeader' },
              {text: 'ZONA / SERVICIO', style: 'tableHeader', alignment: 'center', fillColor: '#53aae0'}
              // {text: 'SESION', style: 'tableHeader', alignment: 'center', fillColor: '#53aae0'},
              // {text: 'PRECIO', style: 'tableHeader', alignment: 'center', fillColor: '#53aae0'},
              // {text: 'SESION', style: 'tableHeader', alignment: 'center', fillColor: '#53aae0'},
              // {text: 'PRECIO', style: 'tableHeader', alignment: 'center'}
              ],
          ]
        }
      };

      // Buscar los precios de las zonas segun la promocion


      await _idZonas.forEach((v, i) => {

        // Buscar si se encuentra la zona en la lista de la promocion
        const zona: any = listaPromocionPrecioZonas.find(promoZona => promoZona.idZona === v);
        // Si se encuentra
        if (zona) {

          const row: any = [
            {text: (i+1), style: 'tableBody'},
            {text:zona.zonaCorporal, style: 'tableBody'},
          ];

          zona.precioBloques.forEach( (pb, ii) => {
            if(i === 0){
              _tabla.table.widths.push('auto');
              _tabla.table.widths.push('auto');

              _tabla.table.body[0].push({text: 'SESION', style: 'tableHeader', alignment: 'center', fillColor: '#53aae0'});
              _tabla.table.body[0].push({text: 'PRECIO', style: 'tableHeader', alignment: 'center', fillColor: '#53aae0'});
            }

            row.push({text: pb.columnaBloque, alignment: 'center', style: 'tableBody'});
            row.push({text: pb.precioBloque.toFixed(2).toString() , alignment: 'center', style: 'tableBody'});
          });

          _tabla.table.body.push(row);
        }
      });

      //TODO: Show because it doesn't show the zones
      console.log(_tabla);

      let _plantilla = JSON.parse(plantilla);
      _plantilla.forEach( (line, index) => {
        if(JSON.stringify(line).includes('@tblzonas')){
          _plantilla[index] = _tabla;
          _plantilla[(index+1)].margin[1] = 15;
        }
      });

      output = JSON.stringify(_plantilla);

      return output;
    }

    private construirTablaZonasSeleccionadas(zonasSeleccionadas: any[]): any {
      return {
        table: {
          widths: ['auto', '*'],
          headerRows: 1,
          body: [
            [
              { text: 'N°', style: 'tableHeader', alignment: 'center' },
              { text: 'Zonas Contratadas', style: 'tableHeader', alignment: 'center' }
            ],
            ...zonasSeleccionadas.map((zona, idx) => [
              { text: idx + 1, alignment: 'center', style: 'tableBody' },
              { text: zona.descripcion, style: 'tableBody' }
            ])
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 10, 0, 10]
      };
    }
}

export interface IZoneSelected {
  id:             number;
  idZonaCorporal: number;
  descripcion:    string;
  seleccionado:   boolean;
}