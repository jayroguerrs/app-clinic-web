import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { environment } from '../../../environments/environment';
import {map, catchError} from "rxjs/operators";
import {
  Cita,
  CitaClass, CitaCliente,
  CitaDatos,
  CitaExportar,
  CitaHistoriaMasiva,
  CitaPromocion,
  CitaReporte,
  CitaReporteDetallado, CitaReporteDetalladoAgendado, CitaSinSiguienteCita, ParametroUpdate
} from "../models/cita";
import {ErrorSistema} from "../models/error-sistema";
import {CitaNuevoItem} from "../models/facturacion/factura-datos-cita";

@Injectable({ providedIn: 'root' })

export class CitaService {

    headers: HttpHeaders;
    constructor(
        private http: HttpClient
    ) {
      this.headers = new HttpHeaders({
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
      });
    }
    obtenerDatosPreliminares(): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/api/cita/datosPreliminares`);
    }
    obtenerCitasListado(fechaCita, horaDesde: string, horaHasta: string, idSede: number, idEstado: number, pacienteCelular: string, tipocita: number, idServicio: number, idZonaContiene: number, nacio: number): Observable<object[]> {
        return this.http.get<object[]>(`${environment.apiUrl}/api/cita/${fechaCita},${horaDesde},${horaHasta},${idSede},${idEstado},${pacienteCelular},${tipocita},${idServicio},${idZonaContiene},${nacio}`,{headers: this.headers});
    }

    obtenerCitasListadoInfo(fechaCita, horaDesde: string, horaHasta: string, idSede: number, idEstado: number, pacienteCelular: string, tipocita: number, idServicio: number, idZonaContiene: number, nacio: number): Observable<object[]> {
      return this.http.get<object[]>(`${environment.apiUrl}/api/cita/reporte-info/${fechaCita},${horaDesde},${horaHasta},${idSede},${idEstado},${pacienteCelular},${tipocita},${idServicio},${idZonaContiene},${nacio}`,{headers: this.headers});
    }


    obtenerCitasListadoExportar(fechaCita, horaDesde: string, horaHasta: string, idSede: number, idEstado: number, pacienteCelular: string, tipocita: number): Observable<CitaExportar[]> {
      return this.http.get<any>(`${environment.apiUrl}/api/cita/exportar/${fechaCita},${horaDesde},${horaHasta},${idSede},${idEstado},${pacienteCelular},${tipocita}`,{headers: this.headers}).pipe(
        map((res) => {
          const collection: CitaExportar[] = [];
          if(res.status === 200){

            res.data.forEach( c => {
              const cita = new CitaExportar();
              cita.idCita = c.idCita;
              cita.sede = c.sede;
              cita.cliente = c.cliente;
              cita.fechaCita = c.fechaCita;
              cita.zonas = c.zonas;
              cita.promociones = c.promociones;
              cita.horaInicio = c.horaInicio;
              cita.estado = c.estado;
              cita.pagado = c.pagado;
              cita.total = c.total;
              collection.push(cita);
            });

          }
          return collection;
        }),catchError((err) => {
          return throwError(err);
        })
      );
    }
    obtenerDashboard(fecha, idSede: number, idPerfil: number): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/api/cita/obtenerDashboard/${fecha},${idSede},${idPerfil}`, {headers: this.headers});
    }
    obtenerById(idCita: number, esReprogramacion: boolean): any {
      console.log(`idCita: ${idCita}, esReprogramacion: ${esReprogramacion}`);
      
        return this.http.get<any>(`${environment.apiUrl}/api/cita/byId/${idCita}/${esReprogramacion}`, {headers: this.headers});
    }
    grabar(cita): any {
        return this.http.post(`${environment.apiUrl}/api/cita`, cita, {headers: this.headers});
    }
    actualizar(cita): any {
        return this.http.put(`${environment.apiUrl}/api/cita`, cita, {headers: this.headers});
    }


    actualizarCondicionNoAsistio(cita): Observable<any> {
      return this.http.put<any>(`${environment.apiUrl}/api/cita/actualizarCitaNoAsistio`, cita, {headers: this.headers});
  }
    actualizarCondicionPendiente(cita): Observable<any> {
        return this.http.put<any>(`${environment.apiUrl}/api/cita/actualizarCitaPendiente`, cita, {headers: this.headers});
    }
    actualizarCondicionAnular(cita): Observable<any> {
        return this.http.put<any>(`${environment.apiUrl}/api/cita/actualizarCitaAnular`, cita, {headers: this.headers});
    }
    actualizarCondicionCancelar(cita): Observable<any> {
        return this.http.put<any>(`${environment.apiUrl}/api/cita/actualizarCitaCancelar`, cita, {headers: this.headers});
    }
    actualizarCondicionNollamar(cita): Observable<any> {
      return this.http.put<any>(`${environment.apiUrl}/api/cita/actualizarCitaNollamar`, cita, {headers: this.headers});
    }
    actualizarCondicionConfirmar(cita): Observable<any> {
        return this.http.put<any>(`${environment.apiUrl}/api/cita/actualizarCitaConfirmar`, cita, {headers: this.headers});
    }
    actualizarCondicionConfirmarAsistencia(cita): Observable<any> {
      return this.http.put<any>(`${environment.apiUrl}/api/cita/actualizarCitaConfirmarAsistencia`, cita, {headers: this.headers});
    }



    obtenerParaPerfil(idCliente): Observable<any>{
        return this.http.get<any>(`${environment.apiUrl}/api/cita/resumenParaPerfil/${idCliente}`, {headers: this.headers}).pipe(
          map(res => {

            const OCitas: CitaClass[] = [];

            res.forEach( r => {
              const OCita = new CitaClass();
              OCita.id = r.idCita;
              OCita.numeroCita = r.numeroCita;
              OCita.colorEstado = r.colorEstado;
              OCita.fechaCita = new Date(r.fechaCita);
              OCita.fechaRegistra = new Date(r.fechaRegistra);
              OCita.hora = r.horaCita;
              OCita.cliente = {
                id: r.idCliente,
                foto: r.foto,
                codigo: r.codigoPaciente
              };
              OCita.tipoCita = {
                id: r.idTipoCita,
                nombre: r.tipoCita,
                nombreCorto: r.tipoCitaCorto
              };
              OCita.resumen = r.resumen;
              OCita.sede = {
                id: r.idSede,
                nombre: r.sede
              };
              OCita.pagado = r.pagado;
              OCita.duracion = r.duracion;
              OCita.numeroSesion = r.numeroSesion;
              OCita.estado = {
                id: r.idEstado,
                nombre: r.estado
              }
              OCita.servicio = r.servicio;
              OCita.servicioColor = r.servicioColor;

              OCita.idPreferente = r.idPreferente;

              OCitas.push(OCita);
            });

            return OCitas;
          }), catchError( err => {
            return throwError(err);
          })
        );
    }

    obtenerParaPerfilByServicio(idCliente: number, idServicio: number): Observable<any>{
      return this.http.get<any>(`${environment.apiUrl}/api/cita/resumenParaPerfil/${idCliente}/servicio/${idServicio}`, {headers: this.headers}).pipe(
        map(res => {

          const OCitas: CitaClass[] = [];

          res.forEach( r => {
            const OCita = new CitaClass();
            OCita.idCronograma = r.idCronograma;
            OCita.id = r.idCita;
            OCita.numeroCita = r.numeroCita;
            OCita.colorEstado = r.colorEstado;
            OCita.fechaCita = new Date(r.fechaCita);
            OCita.fechaRegistra = new Date(r.fechaRegistra);
            OCita.hora = r.horaCita;
            OCita.cliente = {
              id: r.idCliente,
              foto: r.foto,
              codigo: r.codigoPaciente
            };
            OCita.tipoCita = {
              id: r.idTipoCita,
              nombre: r.tipoCita,
              nombreCorto: r.tipoCitaCorto
            };
            OCita.resumen = r.resumen;
            OCita.sede = {
              id: r.idSede,
              nombre: r.sede
            };
            OCita.pagado = r.pagado;
            OCita.duracion = r.duracion;
            OCita.numeroSesion = r.numeroSesion;
            OCita.estado = {
              id: r.idEstado,
              nombre: r.estado
            }
            OCita.idServicio = r.idServicio;
            OCita.servicio = r.servicio;
            OCita.servicioColor = r.servicioColor;

            OCita.idPreferente = r.idPreferente;

            OCitas.push(OCita);
          });

          return OCitas;
        }), catchError( err => {
          return throwError(err);
        })
      );
    }

    obtenerDetalleCitaZona(idCita: number): any {
        return this.http.get(`${environment.apiUrl}/api/cita/detalleCitaPrecio/${idCita}`, {headers: this.headers});
    }
    actualizarEstadoAtendido(cita): any {
        return this.http.put(`${environment.apiUrl}/api/cita/estadoAtendido`, cita, {headers: this.headers});
    }
    obtenerComisionesResumen(fechaInicio, fechaTermino, idUsuarioOperador: number): any {
        return this.http.get(`${environment.apiUrl}/api/cita/resumenComisiones/${fechaInicio}/${fechaTermino}/${idUsuarioOperador}`, {headers: this.headers});
    }
    obtenerComisionesDetalle(fechaInicio, fechaTermino, idUsuarioOperador: number): any {
        return this.http.get(`${environment.apiUrl}/api/cita/detalleComisiones/${fechaInicio}/${fechaTermino}/${idUsuarioOperador}`, {headers: this.headers});
    }
    obtenerNotasEnCitaNueva(idCliente: number): any {
        return this.http.get(`${environment.apiUrl}/api/cita/obtenerNotasCitaNueva/${idCliente}`, {headers: this.headers});
    }


    obtenerHorariosNoDisponible(fecha, idMaquina, idSede, idUsuario, idAccion, idCita): any {
        return this.http.get<object[]>(`${environment.apiUrl}/api/citaDetalle/horarioNoDisponible/${fecha},${idMaquina},${idSede},${idUsuario},${idAccion}, ${idCita}`, {headers: this.headers});
    }

    ObtenerAgendadasRangoFechaVenta(fechaInicio: string, fechaFin: string, idSede: number, idGenero: number): Observable<Cita[]> {
      return this.http.get<any>(`${environment.apiUrl}/api/cita/agendadas/${fechaInicio}/${fechaFin}/${idSede}/${idGenero}`, {headers: this.headers}).pipe(
        map((res) => {
          const collection: Cita[] = [];

          if(res.status === 200){
            res.data.forEach( x => {
              const cita = new Cita();
              cita.idSede = x.idSede;
              cita.sede = x.sede;
              cita.numCitas = x.numCitas;
              cita.fechaCita = new Date(x.fechaCita);

              collection.push(cita);
            });
          }

          return collection;
        }),
        catchError(err => {
          return throwError(err.message, err.code);
        })
      );
    }

  ObtenerAtendidasRangoFechaVenta(fechaInicio: string, fechaFin: string, idSede: number, idGenero: number): Observable<Cita[]> {
    return this.http.get<any>(`${environment.apiUrl}/api/cita/atendidas/${fechaInicio}/${fechaFin}/${idSede}/${idGenero}`, {headers: this.headers}).pipe(
      map((res) => {
        const collection: Cita[] = [];

        if(res.status === 200){
          res.data.forEach( x => {
            const cita = new Cita();
            cita.idSede = x.idSede;
            cita.sede = x.sede;
            cita.numCitas = x.numCitas;
            cita.fechaCita = new Date(x.fechaCita);

            collection.push(cita);
          });
        }

        return collection;
      }),
      catchError(err => {
        return throwError(err.message, err.code);
      })
    );
  }

  ObtenerDeCortesiaRangoFechaVenta(fechaInicio: string, fechaFin: string, idSede: number, idGenero): Observable<Cita[]> {
    return this.http.get<any>(`${environment.apiUrl}/api/cita/cortesia/${fechaInicio}/${fechaFin}/${idSede}/${idGenero}`, {headers: this.headers}).pipe(
      map((res) => {
        const collection: Cita[] = [];

        if(res.status === 200){
          res.data.forEach( x => {
            const cita = new Cita();
            cita.idSede = x.idSede;
            cita.sede = x.sede;
            cita.numCitas = x.numCitas;
            cita.fechaCita = new Date(x.fechaCita);

            collection.push(cita);
          });
        }

        return collection;
      }),
      catchError(err => {
        return throwError(err.message, err.code);
      })
    );
  }


  ObtenerPorPromocionRangoFechaVenta(fechaInicio: string, fechaFin: string, idSede: number): Observable<CitaPromocion[]> {
    return this.http.get<any>(`${environment.apiUrl}/api/cita/promocion/${fechaInicio}/${fechaFin}/${idSede}`, {headers: this.headers}).pipe(
      map((res) => {
        const collection: CitaPromocion[] = [];

        if(res.status === 200){
          res.data.forEach( x => {
            const cita = new CitaPromocion();
             cita.idCita = x.idCita;
             cita.idSede = x.idSede;
             cita.sede = x.sede;
             cita.numeroCita = x.numeroCita;
             cita.cliente = x.cliente;
             cita.fechaCita = new Date(x.fechaCita);
             cita.horaCita = x.horaCita;
             cita.zona = x.zona;
             cita.idZona = x.idZona;
             cita.sesion = x.sesion;
             cita.idPromocion = x.idPromocion;
             cita.promocion = x.promocion;
             cita.promoFechaIni = new Date(x.promoFechaIni);
             cita.promoFechaFin = new Date(x.promoFechaFin);
             cita.precioZona = x.precioZona;
             cita.totalCita = x.totalCita;
             cita.estado = x.estado;

            collection.push(cita);
          });
        }

        return collection;
      }),
      catchError(err => {
        return throwError(err.message, err.code);
      })
    );
  }


  citasAtendidasPorCliente(idCliente: number): Observable<Cita[]> {
    return this.http.get<any>(`${environment.apiUrl}/api/cliente/citasAtendidas/${idCliente}`, {headers: this.headers}).pipe(
      map((res) => {
        const collection: Cita[] = [];

        if(res.status === 200){
          res.data.forEach( x => {
            const cita = new Cita();
            cita.id = x.idCita;
            cita.fechaCita = new Date(x.fechaCita);
            cita.estado = x.estado;
            cita.colorEstado = x.estadoColor;

            collection.push(cita);
          });
        }

        return collection;
      }),
      catchError(err => {
        return throwError(err.message, err.code);
      })
    );
  }

  ObtenerReporte(fechaInicio: string, fechaFin: string, idSede: number, idServicio: number, idEstado: number, idTipoCita: number, idZona: number, clieneNuevo: any = null): Observable<CitaReporte[]> {
    return this.http.get<any>(`${environment.apiUrl}/api/cita/reporte/${fechaInicio}/${fechaFin}/${idSede}/${idEstado}/${idServicio}/${idTipoCita}/${idZona}?nuevoCliente=${!clieneNuevo ? "" : clieneNuevo}`, {headers: this.headers}).pipe(
      map((res) => {
        const collection: CitaReporte[] = [];

        if(res.status === 200){
          res.data.forEach( x => {
            const cita = new CitaReporte();
            cita.idCita = x.idCita;
            cita.idCliente = x.idCliente;
            cita.cliente = x.cliente;
            cita.documentoIdentidad = x.documentoIdentidad;
            cita.telefono = x.telefono;
            cita.tipoCliente = x.tipoCliente;
            cita.fecha = new Date(x.fecha);
            cita.idEstado = x.idEstado;
            cita.estado = x.estado;
            cita.estadoColor = x.estadoColor;
            cita.idServicio = x.idServicio;
            cita.servicio = x.servicio;
            cita.idSede = x.idSede;
            cita.sede = x.sede;
            cita.idTipoCita = x.idTipoCita;
            cita.tipoCita = x.tipoCita;
            cita.zonas = x.zonas;
            cita.genero = x.genero;
            cita.alias = x.alias;
            cita.total = x.total;
            cita.fechaRegistro = new Date(x.fechaRegistro);
            cita.distrito = x.distrito;
            cita.atendidoPor = x.atendidoPor;
            cita.utmTerm = x.utmTerm;
            cita.utmSource = x.utmSource;
            cita.utmCampaign = x.utmCampaign;
            cita.utmCont = x.utmCont;
            cita.medioContacto = x.medioContacto;
            cita.utmMedium = x.utmMedium;
            cita.motivo = x.motivo;
            cita.usuarioSeguimiento = x.usuarioSeguimiento;

            collection.push(cita);
          });
        }

        return collection;
      }),
      catchError(err => {
        return throwError(err.message, err.code);
      })
    );
  }




  ObtenerReporteDetallado(fechaInicio: string, fechaFin: string, idSede: number, idServicio: number, idEstado: number, idTipoCita: number, idZona: number): Observable<CitaReporteDetallado[]> {
    return this.http.get<any>(`${environment.apiUrl}/api/cita/reporte-detallado/${fechaInicio}/${fechaFin}/${idSede}/${idEstado}/${idServicio}/${idTipoCita}/${idZona}`, {headers: this.headers}).pipe(
      map((res) => {
        const collection: CitaReporteDetallado[] = [];

        if(res.status === 200){
          res.data.forEach( x => {
            const cita = new CitaReporteDetallado();
            cita.idCita = x.idCita;
            cita.idCliente = x.idCliente;
            cita.cliente = x.cliente;
            cita.documentoIdentidad = x.documentoIdentidad;
            cita.telefono = x.telefono;
            cita.tipoCliente = x.tipoCliente;
            cita.fecha = new Date(x.fecha);
            cita.idEstado = x.idEstado;
            cita.estado = x.estado;
            cita.estadoColor = x.estadoColor;
            cita.idServicio = x.idServicio;
            cita.servicio = x.servicio;
            cita.idSede = x.idSede;
            cita.sede = x.sede;
            cita.idTipoCita = x.idTipoCita;
            cita.tipoCita = x.tipoCita;
            cita.zona = x.zona;
            cita.genero = x.genero;
            cita.alias = x.alias;
            cita.precio = x.precio;
            cita.sesion = x.sesion;
            cita.origen = x.origen;
            cita.agendadoPor = x.agendadoPor;
            cita.usuarioRegistro = x.usuarioRegistro;
            cita.promocion = x.promocion;
            cita.total = x.total;

            collection.push(cita);
          });
        }

        return collection;
      }),
      catchError(err => {
        return throwError(err.message, err.code);
      })
    );
  }

  ObtenerReporteDetalladoAgendado(fechaInicio: string, fechaFin: string, idSede: number, idServicio: number, idTipoCliente: number, idEstado: number, idUsuarioAgendo: number): Observable<CitaReporteDetalladoAgendado[]> {
    return this.http.get<any>(`${environment.apiUrl}/api/cita/reporte-agendado-operador/${fechaInicio}/${fechaFin}/${idSede}/${idServicio}/${idTipoCliente}/${idEstado}/${idUsuarioAgendo}`, {headers: this.headers}).pipe(
      map((res) => {
        const collection: CitaReporteDetalladoAgendado[] = [];

        if(res.status === 200){
          res.data.forEach( x => {
            const cita = new CitaReporteDetalladoAgendado();
            cita.idCita = x.idCita;
            cita.idCliente = x.idCliente;
            cita.nombreCliente = x.nombreCliente;
            cita.apellidoCliente = x.apellidoCliente;
            cita.documentoCliente = x.documentoCliente;
            cita.telefonoCliente = x.telefonoCliente;
            cita.zona = x.zona;
            cita.sesion = x.sesion;
            cita.promocion = x.promocion;
            cita.precio = x.precio;
            cita.idEstado = x.idEstado;
            cita.estado = x.estado;
            cita.estadoColor = x.estadoColor;
            cita.idTipoCliente = x.idTipoCliente;
            cita.tipoCliente = x.tipoCliente;
            cita.idSede = x.idSede;
            cita.sede = x.sede;
            cita.fechaCita = new Date(x.fechaCita);
            cita.idServicio = x.idServicio;
            cita.servicio = x.servicio;
            cita.servicioColor = x.servicioColor;
            cita.idUsuarioAgendo = x.idUsuarioAgendo;
            cita.usuarioAgendo = x.usuarioAgendo;
            cita.idUsuarioRegistro = x.idUsuarioRegistro;
            cita.usuarioRegistro = x.usuarioRegistro;
            cita.fechaRegistro = new Date(x.fechaRegistro);

            collection.push(cita);
          });
        }

        return collection;
      }),
      catchError(err => {
        return throwError(err.message, err.code);
      })
    );
  }

  HistoriaEnvioMasivo(model: CitaHistoriaMasiva): Observable<boolean | ErrorSistema> {
    return this.http.post<any>(`${environment.apiUrl}/api/cita/envio-masivo-historia`, model,{headers: this.headers}).pipe(
      map((res) => {
        const collection: CitaReporte[] = [];

        if(res.status === 200){
          return true;
        }else{
          const noti = new ErrorSistema();
          noti.message = res.message;
          noti.status = res.status;
        }
      }),
      catchError(err => {
        return throwError(err.message, err.code);
      })
    );
  }


  AgendarSiguienteCita(model: any): Observable<number | ErrorSistema> {
    return this.http.post<any>(`${environment.apiUrl}/api/cita/siguiente-cita`, model,{headers: this.headers}).pipe(
      map((res) => {
        if(res.status === 201){
          return res.data;
        }else{
          const noti = new ErrorSistema();
          noti.message = res.message;
          noti.status = res.status;
          return noti;
        }
      }),
      catchError(err => {
        return throwError(err.message, err.code);
      })
    );
  }


  AgendarSiguienteCitaManual(model: any): Observable<number | ErrorSistema> {
    return this.http.post<any>(`${environment.apiUrl}/api/cita/siguiente-cita-manual`, model,{headers: this.headers}).pipe(
      map((res) => {
        if(res.status === 201){
          return res.data;
        }else{
          const noti = new ErrorSistema();
          noti.message = res.message;
          noti.status = res.status;
          return noti;
        }
      }),
      catchError(err => {
        return throwError(err.message, err.code);
      })
    );
  }


  obtenerTaco(idCita: number, idUsuario: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/cita/obtener-taco/${idCita}/${idUsuario}`, {headers: this.headers});
  }


  marcarAtendida(idCita: number, idUsuario: number): Observable<number | ErrorSistema> {
    return this.http.put<any>(`${environment.apiUrl}/api/cita/${idCita}/${idUsuario}/marcar-atendido`, {}, {headers: this.headers}).pipe(
      map((res) => {
        if(res.status === 200){
          return res.data;
        }else{
          const noti = new ErrorSistema();
          noti.message = res.message;
          noti.status = res.status;
        }
      }),
      catchError(err => {
        return throwError(err.message, err.code);
      })
    );
  }


  agregarDetalle(idCita: number, nuevoDetalle: CitaNuevoItem): Observable<boolean | ErrorSistema> {
    return this.http.post<any>(`${environment.apiUrl}/api/cita/${idCita}/agregar-detalle`, nuevoDetalle, {headers: this.headers}).pipe(
      map((res) => {
        if(res.status === 201){
          return true;
        }else{
          const noti = new ErrorSistema();
          noti.message = res.message;
          noti.status = res.status;
        }
      }),
      catchError(err => {
        return throwError(err.message, err.code);
      })
    );
  }

  obtenerCitasAtendidasSinSiguienteCita(fechaDesde: string, fechaHasta: string, idServicio: number, idUsuario: number): Observable<CitaSinSiguienteCita[] | ErrorSistema> {
    return this.http.get<any>(`${environment.apiUrl}/api/cita/obtener-sin-siguientecita/${fechaDesde}/${fechaHasta}/${idServicio}/${idUsuario}`, {headers: this.headers}).pipe(
      map((res) => {
        if(res.status === 200){
          const collection: CitaSinSiguienteCita[] = [];
          res.data.forEach(x => {
            const model = new CitaSinSiguienteCita();
            model.idCita = x.idCita;
            model.cliente = x.cliente;
            model.idCliente = x.idCliente;
            model.telefonoCliente = x.telefonoCliente;
            model.fechaCita = new Date(x.fechaCita);
            model.servicio = x.servicio;
            model.colorServicio = x.colorServicio;
            model.sede = x.sede;
            model.estadoCita = x.estadoCita;
            model.colorEstadoCita = x.colorEstadoCita;
            model.pagado = x.pagado;
            collection.push(model);
          });
          return collection;
        }else{
          const noti = new ErrorSistema();
          noti.message = res.message;
          noti.status = res.status;
          return noti;
        }
      }),
      catchError(err => {
        return throwError(err.message, err.code);
      })
    );
  }




  obtenerDatos(idCita: number, idUsuario: number): Observable<CitaDatos | ErrorSistema>{
    return this.http.get<any>(`${environment.apiUrl}/api/cita/obtener-datos/${idCita}/${idUsuario}`, {headers: this.headers}).pipe(
      map(res => {

        if(res.status === 200){
          const citaDatos = new CitaDatos();

          const data = res.data;

          citaDatos.idCita =  data.idCita;
          citaDatos.fechaCita =  new Date(data.fechaCita);
          citaDatos.idSede =  data.idSede;
          citaDatos.sede =  data.sede;
          citaDatos.idServicio =  data.idServicio;
          citaDatos.servicio =  data.servicio;
          citaDatos.servicioColor =  data.servicioColor;
          citaDatos.duracion =  data.duracion;
          citaDatos.horaInicio =  new Date('1999-01-01T'+data.horaInicio);
          citaDatos.horaTermino =  new Date('1999-01-01T'+data.horaTermino);
          citaDatos.minutoInicio =  data.minutoInicio;
          citaDatos.minutoTermino =  data.minutoTermino;
          citaDatos.idEstado =  data.idEstado;
          citaDatos.estado =  data.estado;
          citaDatos.estadoColor =  data.estadoColor;

          return citaDatos;
        }else{
          const noti = new ErrorSistema();
          noti.message = res.message;
          noti.status = res.status;
          return noti;
        }


      }), catchError( err => {
        throw Error(err);
      })
    );
  }


  modificarMaquina(model: any): Observable<boolean | ErrorSistema> {
    return this.http.put<any>(`${environment.apiUrl}/api/cita/${model.idCita}/modificar-maquina`, model, {headers: this.headers}).pipe(
      map((res) => {
        if(res.status === 200){
          return true;
        }else{
          const noti = new ErrorSistema();
          noti.message = res.error;
          noti.status = res.status;

          return noti;
        }
      }),
      catchError(err => {
        return throwError(err.message);
      })
    );
  }


  obtenerCitasClienteAsignado(id: number): Observable<CitaCliente[] | ErrorSistema>{
    return this.http.get<any>(`${environment.apiUrl}/api/cita/cliente-asignado/${id}`, {headers: this.headers}).pipe(
      map((res) => {
        if(res.status === 200){
          const collection: CitaCliente[] = [];
          res.data.forEach(x => {
            const model = new CitaCliente();
            model.id = x.id;
            model.idCronograma = x.idCronograma;
            model.cliente = x.cliente;
            model.idCliente = x.idCliente;
            model.fecha = new Date(x.fecha);
            model.telefono = x.telefono;
            model.servicio = x.servicio;
            model.servicioColor = x.servicioColor;
            model.idServicio = x.idServicio;
            model.sede = x.sede;
            model.idSede = x.idSede;
            model.estado = x.estado;
            model.estadoColor = x.estadoColor;
            model.idEstado = x.idEstado;
            model.idEstadoInicial = x.idEstado;
            collection.push(model);
          });
          return collection;
        }else{
          const noti = new ErrorSistema();
          noti.message = res.message;
          noti.status = res.status;
          return noti;
        }
      }),
      catchError(err => {
        return throwError(err.message, err.code);
      })
    );
  }

  actualizarTratamientoRealizado(estado: number, idCitaDetalle: number){
    return this.http.put<any>(`${environment.apiUrl}/api/cita/${estado}/${idCitaDetalle}/actualizar-tratamiento-realizado`, {headers: this.headers}).pipe(
      catchError( err => {
        throw Error(err);
      })
    );
  }

  obtenerHistorialParametros(idCliente: number, idServicio: number, idZona: number): any {
      return this.http.get(`${environment.apiUrl}/api/cita/historial-parametros/${idCliente}/${idServicio}/${idZona}`, {headers: this.headers});
  }

  actualizarParametros(model: ParametroUpdate): any {
    return this.http.patch(`${environment.apiUrl}/api/cita/actualizar-parametro`, model, {headers: this.headers});
  }
}
