import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { MdlTipoDePagoComponent } from '../../componentes/modals/mdl-tipo-de-pago/mdl-tipo-de-pago.component';

@Injectable({
  providedIn: 'root'
})
export class ControlDeCitasService {
    celularPaciente: string = "";
    fechaCita: string = "";
  
    private headers: HttpHeaders;
    constructor(
        private http: HttpClient,
        public dialog: MatDialog,
    ) {
      this.headers = new HttpHeaders({
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
      });
    }

  
    getCitasByUser(idUsuario, pagina, rowsperpage, fechaInicio, fechaFin, busqueda, pagado, estado, mostrarPagadosMensual, mostrarAbonado, ocultarAnulados = false){
      return this.http.get<object[]>(`${environment.apiUrl}/api/controldecita/listadoControlByUser/${idUsuario}/${pagina}/${rowsperpage}?FechaInicio=${!fechaInicio ? "" : fechaInicio}&FechaFin=${!fechaFin ? "" : fechaFin}&Busqueda=${!busqueda ? "" : busqueda}&Pagado=${!pagado ? "" : pagado}&Estado=${!estado ? "" : estado}&MostrarPagadosMensual=${!mostrarPagadosMensual ? "" : mostrarPagadosMensual}&MostrarAbonado=${!mostrarAbonado ? "" : mostrarAbonado}&OcultarAnulados=${!ocultarAnulados ? "" : 1}`, {headers: this.headers});
    }

    getCitasByUserExcel(idUsuario, fechaInicio, fechaFin, ocultarAnulados = false, estado){
      return this.http.get<object[]>(`${environment.apiUrl}/api/controldecita/listadoControlByUserExcel/${idUsuario}?FechaInicio=${!fechaInicio ? "" : fechaInicio}&FechaFin=${!fechaFin ? "" : fechaFin}&OcultarAnulados=${!ocultarAnulados ? "" : 1}&Estado=${!estado ? "" : estado}`, {headers: this.headers});
    }

    updatePayment(idCita, montoFinal, idUsuario, tipoDePago = null){
      return this.http.patch<object>(`${environment.apiUrl}/api/controldecita/changeFinalPayment/${idCita}/${montoFinal}/${idUsuario}?TipoDePago=${!tipoDePago ? "" : tipoDePago}`, {headers: this.headers});
    }

    updateZonaPayment(idDetalle, montoNuevoPagoFinal, idCita){
      return this.http.patch<object>(`${environment.apiUrl}/api/controldecita/changeZonaFinalPayment/${idDetalle}/${montoNuevoPagoFinal}/${idCita}`, {headers: this.headers});
    }

    listadoParaControlDeCitasTest(){
      return this.http.get<any[]>('assets/mock-data/MOCK_DATA.json').pipe(delay(4000));
    }

    enviarNotificaionDePago(idOperador, idSede, nombreOperador, idCita){
      return this.http.post<any>(`${environment.apiUrl}/api/controldecita/enviarNotificacionDePago/${idOperador}/${idSede}/${nombreOperador}/${idCita}`, {headers: this.headers});
    }

    listadoDeNotificaciones(idSede){
      return this.http.get<any>(`${environment.apiUrl}/api/controldecita/listadoDeNotificaciones/${idSede}`, {headers: this.headers});
    }
    
    totalDeNotificaciones(idSede){
      return this.http.get<any>(`${environment.apiUrl}/api/controldecita/numeroTotalDeNotificaciones/${idSede}`, {headers: this.headers});
    }

    completarNotificacion(idNotificacion){
      return this.http.patch<any>(`${environment.apiUrl}/api/controldecita/completarNotificacion/${idNotificacion}`, {headers: this.headers});
    }

    mostrarSuccesPaymentToast(reload: boolean){
      Swal.fire({ 
        title: 'Pago confirmado',
        icon: 'success',
        confirmButtonColor: "#3085d6",
        timer: 1500,
        showCancelButton: false,
        showConfirmButton: false,
        allowOutsideClick: false,
      }).then(() => {
        if(reload){
          window.location.reload();
        }
      });
    }

    abrirMdlTipoDePago(idCita: number, paciente: string, montoInicial: number, tipoDePago: number | null, precioDePagoFinal: number | null){
          const sendData = {
            idCita: idCita,
            paciente: paciente,
            montoInicial: montoInicial,
          };
    
          const dialogRef = this.dialog.open(MdlTipoDePagoComponent, {
              width: '430px',
              disableClose: true
            });
    
        // Acceder a las propiedades del componente del diálogo
        dialogRef.componentInstance.data = {
                cita: sendData,
                montoFinal: 0,
                paciente: paciente,
              };
    
        dialogRef.componentInstance.tipoDePagoCita = tipoDePago;
        dialogRef.componentInstance.precioDePagoFinalCita = precioDePagoFinal;
    
        dialogRef.componentInstance.modal = dialogRef;
    
        return dialogRef.afterClosed();
    }
    
}
