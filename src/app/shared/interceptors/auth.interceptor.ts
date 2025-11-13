import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router,
    private spinner: NgxSpinnerService
  ) {}
 
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {    
    const request_url = request.url;
    const isLoginRequest = request_url.includes('api/usuario/login');

    // Clonar la solicitud y agregar el token si no es una solicitud de inicio de sesión
    if (!isLoginRequest) {
      const { token } = JSON.parse(localStorage.getItem('usersKey')) || {};
      if (token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    }

    return next.handle(request).pipe(      
      catchError((error: HttpErrorResponse) => {          
        if (error.status === 401) {
          // Redirigir a la página de no autorizado
          this.router.navigate(['Unauthorized']);
          this.spinner.hide();
        }
        else{
          this.spinner.hide();          
        }
        return throwError(error); // Retornar el error para que otros interceptores puedan manejarlo
      })
    );
  }
}
