import { Injectable } from '@angular/core';
import { CONFIG } from '../configuracion/config';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { environment } from '../../../environments/environment';
import {Cliente, ClienteClass, ClienteDNI, ClienteNuevoReporte,ClienteRuc} from '../models/cliente';
import {catchError, map} from "rxjs/operators";
import {Usuario} from "../models";
import {ClienteFinanciamiento} from "../../shared/models/client";
import {ErrorSistema} from "../models/error-sistema";

@Injectable({ providedIn: 'root' })
export class ClienteService {
    url: string;
    versionapi: string;
    public user: Observable<ClienteClass>;
    headers: HttpHeaders;

    constructor(
        private http: HttpClient
    ) {
        this.url = CONFIG.url;
        this.versionapi = CONFIG.versionApi;
        this.headers = new HttpHeaders({
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
        });
    }

    obtenerClientes(): Observable<object[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/cliente`,{headers:this.headers});
    }
    obtenerClientes10(): Observable<object[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/cliente/listar10Ultimos`,{headers: this.headers});
    }
    obtenerById(id): Observable<IPerfil> {
        return this.http.get<any>(`${environment.apiUrl}/api/cliente/${id}`, {headers: this.headers});
    }
    findById(id): Observable<Cliente> {
      return this.http.get<any>(`${environment.apiUrl}/api/cliente/${id}`, {headers: this.headers}).pipe(
        map((res) => {
          // console.log(res);
          const cliente = new Cliente();
          cliente.id = res.id;
          cliente.nombres = res.nombres;
          cliente.apellidos = res.apellidos;
          cliente.telefono1 = res.celular1;
          cliente.telefono2 = res.celular2;
          cliente.direccion = res.direccion;
          cliente.departamento = res.departamento;
          cliente.distrito = res.distrito;
          cliente.provincia = res.provincia;
          cliente.edad = res.edad;
          cliente.fechaNacimiento = res.fechaNacimiento ? new Date(res.fechaNacimiento) : null;
          cliente.documento = res.documento;
          cliente.idTipoDocumentoIdentidad = res.idDocumentoIdentidadTipo;
          cliente.correo = res.correo;
          cliente.idUbicacion = res.idUbicacion;
          cliente.idGenero = res.idGenero;
          cliente.genero = res.genero;
          cliente.seudonimo = res.seudonimo;
          cliente.idMedioContacto = res.idMedioContacto;
          cliente.paisCelular1 = res.paisCelular1;
          cliente.paisCelular2 = res.paisCelular2;
          cliente.ruc=res.ruc;
          cliente.razonSocial=res.razonSocial;

          return cliente;
        }), catchError((err) => {
          return throwError(err);
        })
      );
    }
    obtenerPerfilById(id): any {
        return this.http.get<any>(`${environment.apiUrl}/api/cliente/perfil/${id}`, {headers: this.headers});
    }
    obtenerTodasZonasAtendidas(id): any {
        return this.http.get<any>(`${environment.apiUrl}/api/cliente/zonasCorporalesAtendidas/${id}`, {headers: this.headers});
    }
    obtenerTodasZonasAtendidasPorServicio(idCliente, idServicio): any {
      return this.http.get<any>(`${environment.apiUrl}/api/cliente/zonasCorporalesAtendidas/${idCliente}/servicio/${idServicio}`, {headers: this.headers});
    }
    obtenerByPreferente(nombres: string, apellidos: string, numeros: string, email: string) {
        return this.http.get<any>(`${environment.apiUrl}/api/cliente/buscar/preferente/${nombres}/${apellidos}/${numeros}/${email}`, {headers: this.headers});
    }
    obtenerPorFiltro(str): Observable<object[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/cliente/buscar/${str}`, {headers: this.headers});
    }
    guardar(cliente): any {
        return this.http.post(`${environment.apiUrl}/api/cliente`, cliente, {headers: this.headers});
    }
    actualizar(cliente): any {
        return this.http.put(`${environment.apiUrl}/api/cliente`, cliente, {headers: this.headers});
    }
    actualizarFirma(cliente): any {
        return this.http.put(`${environment.apiUrl}/api/cliente/modificarFirma`, cliente, {headers: this.headers});
    }
    obtenerFirmaById(id: number): any{
        return this.http.get<any>(`${environment.apiUrl}/api/cliente/firma/${id}`, {headers: this.headers});
    }
    obtenerDatosMaestros(): any {
        return this.http.get<any>(`${environment.apiUrl}/api/cliente/datosMaestros`, {headers: this.headers});
    }
    validarNumeroCelular(idCliente, numeroCelular1, numeroCelular2): any {
        return this.http.get<any>(`${environment.apiUrl}/api/cliente/validarCelular/${idCliente},${numeroCelular1},${numeroCelular2}`, {headers: this.headers});
    }
    obtenerByNumeroCelular(codigoPais1, numero1, codigoPais2, numero2): any {
        return this.http.get<any>(`${environment.apiUrl}/api/cliente/byNumeroCelularSinCodigo/${numero1}/${numero2}`, {headers: this.headers});
    }

    buscarPorParametros(parametros: string): Observable<Cliente[]> {
      return this.http.get<any>(`${environment.apiUrl}/api/cliente/buscarParametros/${parametros}`, {headers: this.headers}).pipe(
        map((res) => {
          const collection : Cliente[] = [];

          if(res.status === 200){
            res.data.forEach((x) => {
              const item = new Cliente();
              item.id = x.id;
              item.nombres = x.nombres;
              item.apellidos = x.apellidos;
              item.documento = x.documento;

              collection.push(item);
            });
          }

          return collection;
        }),catchError((err)=>{
          return throwError(err);
        })
      );
    }

    obtenerFinanciamiento(dni: string): Observable<ClienteFinanciamiento[]> {
    return this.http.get<any>(`${environment.apiWeb}?module=financiamiento&action=listar-por-dni&value=${dni}`, {headers: this.headers})
      .pipe(
        map(res=> {

          const collection: ClienteFinanciamiento[] = [];

          if( res.status === 200 ){

            res.data.forEach(x => {
              const model = new ClienteFinanciamiento();
              model.idOrden = x.IdOrden;
              model.idSubscripcion = x.IdSubscripcion;
              model.estado = x.Estado;
              model.idProducto = x.IdProducto;
              model.nombreProducto = x.NombreProducto;
              model.cuota = x.Cuota;
              model.fechaRegistro = new Date(x.FechaRegistro);
              model.fechaPago = x.FechaPago ? new Date(x.FechaPago) : null;
              model.proximaFacturacion = x.ProximaFacturacion ? new Date(x.ProximaFacturacion) : null;
              model.total = x.Total;
              model.totalNeto = x.TotalNeto;
              model.idCliente = x.IdCliente;
              model.nombreCliente = x.NombreCliente;
              model.apellidoCliente = x.ApellidoCliente;
              model.documentoCliente = x.DocumentoCliente;
              collection.push(model);
            })
          }

          return collection;
        }),
        catchError(err => {
          return throwError(err);
        })
      );
    }



  actualizarDocumentoIdentidad(cliente: Cliente): Observable<boolean | ErrorSistema> {
    return this.http.put<any>(`${environment.apiUrl}/api/cliente/actualizar-documento-identidad/${cliente.id}`,cliente, {headers: this.headers})
      .pipe(
        map(res=> {

          if( res.status === 200 ){
            return true;
          }else{
            const error = new ErrorSistema();
            error.message = res.message;
            error.status = res.status;

            return error;
          }

        }), catchError(err => {
          return throwError(err);
        })
      );
  }


  reporteClientesNuevos(fechaDesde: string, fechaHasta: string): Observable<ClienteNuevoReporte[] | ErrorSistema> {
    return this.http.get<any>(`${environment.apiUrl}/api/cliente/reporte-nuevos/${fechaDesde}/${fechaHasta}`, {headers: this.headers})
      .pipe(
        map(res=> {

          if( res.status === 200 ){

            const collection: ClienteNuevoReporte[] = [];
            res.data.forEach(v => {
              const model = new ClienteNuevoReporte();
              model.id = v.id;
              model.nombres = v.nombres;
              model.apellidos = v.apellidos;
              model.tipoCliente = v.tipoCliente;
              model.genero = v.genero;
              model.celular = v.celular;
              model.correo = v.correo;
              model.numeroDocumento = v.numeroDocumento;
              model.documento = v.documento;
              model.medioContacto = v.medioContacto;
              model.fechaRegistro = new Date(v.fechaRegistro);
              model.distrito = v.distrito;

              collection.push(model);
            });

            return collection;

          }else{
            const error = new ErrorSistema();
            error.message = res.error;
            error.status = res.status;

            return error;
          }

        }), catchError(err => {
          return throwError(err);
        })
      );
  }




  obtenerRuc(ruc:string): Observable<ClienteRuc > {
    return this.http.get<any>(`${environment.apiUrl}/api/cliente/ruc/${ruc}`, {headers: this.headers})
      .pipe(
        map(res=> {

          if( res.status === 200 ){

             const oClienteRuc= new ClienteRuc();
             oClienteRuc.ruc=res.data.ruc;
             oClienteRuc.razonSocial=res.data.nombre_o_razon_social;

            return oClienteRuc;

          }

        }), catchError(err => {
          return throwError(err);
        })
      );
  }


  obtenerDatosDNI(dni:string): Observable<ClienteDNI> {
    return this.http.get<any>(`${environment.apiUrl}/api/cliente/dni/${dni}`, {headers: this.headers})
      .pipe(
        map(res=> {

          if( res.status === 200 ){

             const oClienteDNI= new ClienteDNI();
             oClienteDNI.dni=res.data.numero;
             oClienteDNI.nombresCompleto=res.data.nombre_completo;
             oClienteDNI.nombres=res.data.nombres;
             oClienteDNI.apellidoMaterno=res.data.apellido_materno;
             oClienteDNI.apellidoPaterno=res.data.apellido_paterno;
            return oClienteDNI;
          }
        }), catchError(err => {
          return throwError(err);
        })
      );
  }
}


export interface IPerfil {
    id:                        number;
    idTexto:                   string;
    nombres:                   string;
    apellidos:                 string;
    seudonimo:                 string;
    idGenero:                  number;
    celular1:                  string;
    celular2:                  string;
    correo:                    string;
    idDocumentoIdentidadTipo:  number;
    documento:                 string;
    idUbicacion:               string;
    direccion:                 string;
    distrito:                  string;
    provincia:                 null;
    departamento:              null;
    medioContacto:             string;
    publicidad:                string;
    fechaNacimiento:           Date;
    idEstado:                  number;
    usuarioRegistra:           string;
    fechaRegistra:             Date;
    usuarioEdita:              string;
    fechaEdita:                Date;
    serieFirma:                string;
    serieHuella:               string;
    idHistoriaClinica:         string;
    incidencias:               number;
    numCitas:                  number;
    numCitasDepilacion:        number;
    numCitasBlanqueamiento:    number;
    numCitasTratamientoFacial: number;
    numCitasCorporalHollywood: number;
    numCitasExfoliacion:       number;
    numCitasDermatologia:      number;
    numCitasCorporal:          number;
    numCitasHollywood:         number;
    numZonas:                  number;
    edad:                      number;
    idMedioContacto:           number;
    otroMedioContacto:         null;
    foto:                      string;
    genero:                    string;
    citaNotas:                 null;
    clienteDocumento:          ClienteDocumento;
    fechaEncuesta:             Date;
    encuesta:                  null;
    paisCelular1:              number;
    paisCelular2:              null;
    idEspecialista:            number;
    especialista:              null;
    idUsuarioModifico:         null;
    ruc:                       string;
    razonSocial:               string;
}

export interface ClienteDocumento {
    id:            number;
    documento:     string;
    tipoDocumento: string;
}
