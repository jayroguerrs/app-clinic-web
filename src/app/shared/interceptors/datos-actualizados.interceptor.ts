import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError } from 'rxjs/operators';

@Injectable()
export class DatosActualizadosInterceptor implements HttpInterceptor {


  
  constructor(
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const request_url = request.url;
    const isLoginRequest = request_url.includes('api/usuario/login');
    const isVerClaveRequest = request_url.includes('api/usuario/verClaveUsuario');
    const isVerDniRequest = request_url.includes('api/cliente/dni/');
    const isActualizarDatosRequest = request_url.includes('api/usuario/actualizarDatos');

    
    const userData = JSON.parse(localStorage.getItem('usersKey')) || {};
    const { token, datosActualizados } = userData;

    const isWhitelisted = isLoginRequest || isVerClaveRequest || isVerDniRequest || isActualizarDatosRequest;

    if (!isWhitelisted && datosActualizados !== true) {
      this.router.navigate(['Unauthorized/actualizar-datos']);  // Redirige a una ruta donde se actualicen los datos
      this.spinner.hide();
      return throwError(() => new Error('Los datos del usuario no están actualizados.'));
    }


    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.router.navigate(['Unauthorized/actualizar-datos']);
        }
        this.spinner.hide();
        return throwError(() => error);
      })
    );
  
  }
}
