import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { environment } from '../../../environments/environment';
import {catchError, map} from "rxjs/operators";
import {
  FormularioEncuesta,
  FormularioEncuestaOpcion,
  FormularioEncuestaPregunta,
  FormularioEncuestaRespuesta
} from "../models/formulario-encuesta";
import {Cliente} from "../models/cliente";


@Injectable({ providedIn: 'root' })
export class FormularioEncuestaService {
    private headers: HttpHeaders;
    constructor(
        private http: HttpClient
    ) {
      this.headers = new HttpHeaders({
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
      });
    }

    obtenerListado(idTipo: number = 1): Observable<FormularioEncuesta[]> {
        return this.http.get<any>(`${environment.apiUrl}/api/formularioEncuesta/tipo/${idTipo}`, {headers: this.headers}).pipe(
          map(res => {

            const collection: FormularioEncuesta[] = [];
            if(res.status === 200){
              res.data.forEach( d => {
                const formulario = new FormularioEncuesta();
                formulario.id = d.id;
                formulario.nombre = d.nombre;
                formulario.fechaRegistro = new Date(d.fechaRegistro);
                formulario.usuarioRegistro = d.usuarioRegistro;
                formulario.usuarioModifico = d.usuarioModifico;
                formulario.fechaModifico = d.fechaModifico ? new Date(d.fechaModifico) : null;
                formulario.idEstado = d.idEstado;

                collection.push(formulario);
              });
            }

            return collection;
          }), catchError( err => {
            return throwError(err);
          })
        );
    }


    obtenerListadoByCliente(idTipo: number = 1, idCliente: number): Observable<FormularioEncuesta[]> {
      return this.http.get<any>(`${environment.apiUrl}/api/formularioEncuesta/cliente/${idCliente}/${idTipo}`, {headers: this.headers}).pipe(
        map(res => {

          const collection: FormularioEncuesta[] = [];
          if(res.status === 200){
            res.data.forEach( d => {
              const formulario = new FormularioEncuesta();
              formulario.id = d.id;
              formulario.nombre = d.nombre;
              formulario.fechaRegistro = new Date(d.fechaRegistro);
              formulario.usuarioRegistro = d.usuarioRegistro;
              formulario.usuarioModifico = d.usuarioModifico;
              formulario.fechaModifico = d.fechaModifico ? new Date(d.fechaModifico) : null;
              formulario.idEstado = d.idEstado;
              formulario.realizado = d.realizado;

              collection.push(formulario);
            });
          }

          return collection;
        }), catchError( err => {
          return throwError(err);
        })
      );
    }


  obtenerListadoByClienteFormulario(idFormulario: number, idCliente: number): Observable<FormularioEncuestaRespuesta[]> {
    return this.http.get<any>(`${environment.apiUrl}/api/formularioEncuesta/buscar/${idCliente}/${idFormulario}`, {headers: this.headers}).pipe(
      map(res => {

        const collection: FormularioEncuestaRespuesta[] = [];
        if(res.status === 200){
          res.data.forEach( d => {
            const formulario = new FormularioEncuestaRespuesta();
            formulario.id = d.id;
            formulario.fechaRegistro = new Date(d.fechaRegistro);

            collection.push(formulario);
          });
        }

        return collection;
      }), catchError( err => {
        return throwError(err);
      })
    );
  }


  obtenerById( idFormulario: number ): Observable<FormularioEncuesta> {
    return this.http.get<any>(`${environment.apiUrl}/api/formularioEncuesta/${idFormulario}`, {headers: this.headers}).pipe(
      map(res => {

        const formulario = new FormularioEncuesta();
        if(res.status === 200){
          const data = res.data;
          formulario.id = data.id;
          formulario.nombre = data.nombre;
          formulario.idEstado = data.idEstado;

          data.preguntas.forEach((p) => {
            const pregunta = new FormularioEncuestaPregunta();
            pregunta.id = p.id;
            pregunta.idFormularioEncuesta = p.idFormularioEncuesta;
            pregunta.texto = p.texto;
            pregunta.multiple = p.multiple;
            pregunta.orden = p.orden;
            pregunta.tipoRespuesta = p.tipoRespuesta;
            pregunta.idEstado = p.idEstado;
            pregunta.obligatorio = p.obligatorio;

            p.opciones.forEach((o) => {
              const opcion = new FormularioEncuestaOpcion();
              opcion.id = o.id;
              opcion.idFormularioPregunta = o.idFormularioPregunta;
              opcion.valor = o.valor;
              opcion.adicional = o.adicional;
              opcion.placeholderAdicional = o.placeholderAdicional;
              opcion.orden = o.orden;
              opcion.idEstado = p.idEstado;
              pregunta.opciones.push(opcion);
            });

            formulario.preguntas.push( pregunta );
          });

        }


        return formulario;
      }), catchError( err => {
        return throwError(err);
      })
    );
  }

  registrarEncuesta( model: FormularioEncuestaRespuesta): Observable<boolean> {
    return this.http.post<any>(`${environment.apiUrl}/api/formularioEncuesta`, model ,{headers: this.headers}).pipe(
      map(res => {
       if(res.status === 200){
         return true;
       }
       return false;
      }), catchError( err => {
        return throwError(err);
      })
    );
  }

  buscarReporte(idFormulario: number): Observable<FormularioEncuestaPregunta[]> {
    return this.http.get<any>(`${environment.apiUrl}/api/formularioEncuesta/buscar/${idFormulario}`, {headers: this.headers}).pipe(
      map(res => {

        console.log(res);

        const collection: FormularioEncuestaPregunta[] = [];
        if(res.status === 200){
          const data = res.data;

          data.forEach( p => {
            const pregunta = new FormularioEncuestaPregunta();

            pregunta.id = p.id;
            pregunta.texto = p.texto;
            pregunta.tipoRespuesta = p.tipoRespuesta;
            pregunta.multiple = p.multiple;
            pregunta.orden = p.orden;
            pregunta.respuestas = p.respuestas;
            pregunta.respuesta = p.respuesta;

            p.opciones.forEach((o) => {
              const opcion = new FormularioEncuestaOpcion();
              opcion.id = o.id;
              opcion.valor = o.valor;
              opcion.idFormularioPregunta = o.idFormularioPregunta;
              opcion.orden = o.orden;
              opcion.contador = o.contador;
              pregunta.opciones.push(opcion);
            });

            collection.push(pregunta);
          });

        }

        return collection;
      }), catchError( err => {
        return throwError(err);
      })
    );
  }

  obtenerReporte( idSede: number, idFormulario: number, fechaInicio: string, fechaFin: string): Observable<FormularioEncuestaPregunta[]> {
    return this.http.get<any>(`${environment.apiUrl}/api/formularioEncuesta/reporte/${idSede}/${idFormulario}/${fechaInicio}/${fechaFin}`, {headers: this.headers}).pipe(
      map(res => {

        const collection: FormularioEncuestaPregunta[] = [];
        if(res.status === 200){
          const data = res.data;

          data.forEach( p => {
            const pregunta = new FormularioEncuestaPregunta();

            pregunta.id = p.id;
            pregunta.texto = p.texto;
            pregunta.tipoRespuesta = p.tipoRespuesta;
            pregunta.multiple = p.multiple;
            pregunta.orden = p.orden;
            pregunta.respuestas = p.respuestas;

            p.opciones.forEach((o) => {
              const opcion = new FormularioEncuestaOpcion();
              opcion.id = o.id;
              opcion.valor = o.valor;
              opcion.idFormularioPregunta = o.idFormularioPregunta;
              opcion.orden = o.orden;
              opcion.contador = o.contador;
              pregunta.opciones.push(opcion);
            });

            collection.push(pregunta);
          });

        }

        return collection;
      }), catchError( err => {
        return throwError(err);
      })
    );
  }

  obtenerReporteClientes( idSede: number, idFormulario: number, fechaInicio: string, fechaFin: string): Observable<Cliente[]> {
    return this.http.get<any>(`${environment.apiUrl}/api/formularioEncuesta/clientes/${idSede}/${idFormulario}/${fechaInicio}/${fechaFin}`, {headers: this.headers}).pipe(
      map(res => {

        const collection: Cliente[] = [];
        if(res.status === 200){
          const data = res.data;

          data.forEach( c => {
            const cliente = new Cliente();

            cliente.id = c.id;
            cliente.nombres = c.nombres;
            cliente.apellidos = c.apellidos;
            cliente.telefono1 = c.celular1;
            cliente.fechaEncuesta = new Date(c.fechaEncuesta);
            cliente.encuesta = c.encuesta;

            collection.push(cliente);
          });

        }

        return collection;
      }), catchError( err => {
        return throwError(err);
      })
    );
  }
}
